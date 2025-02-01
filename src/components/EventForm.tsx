import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventFormData } from "../types/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  onDelete?: () => void;
  initialData?: Partial<EventFormData>;
  isEditing?: boolean;
}

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];

const REMINDER_OPTIONS = [
  { value: 0, label: "No reminder" },
  { value: 5, label: "5 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
];

export const EventForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete, 
  initialData,
  isEditing 
}: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Omit<EventFormData, 'start' | 'end'> & { start: string; end: string }>({
    defaultValues: {
      title: "",
      description: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      reminder: 0,
    },
  });

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedReminder, setSelectedReminder] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title || "");
      setValue("description", initialData.description || "");
      setValue("start", initialData.start ? format(new Date(initialData.start), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      setValue("end", initialData.end ? format(new Date(initialData.end), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      setSelectedColor(initialData.color || COLORS[0]);
      setSelectedReminder(initialData.reminder || 0);
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data: Omit<EventFormData, 'start' | 'end'> & { start: string; end: string }) => {
    const formattedData: EventFormData = {
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
      color: selectedColor,
      reminder: selectedReminder,
    };
    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Input
              placeholder="Event Title"
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" },
                maxLength: { value: 50, message: "Title must not exceed 50 characters" }
              })}
              className="w-full"
            />
            {errors.title && (
              <span className="text-sm text-red-500">{errors.title.message}</span>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Event Description"
              {...register("description", {
                required: "Description is required",
                minLength: { value: 5, message: "Description must be at least 5 characters" },
                maxLength: { value: 200, message: "Description must not exceed 200 characters" }
              })}
              className="w-full"
            />
            {errors.description && (
              <span className="text-sm text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <Input
                type="datetime-local"
                {...register("start", { required: "Start time is required" })}
                className="w-full"
              />
              {errors.start && (
                <span className="text-sm text-red-500">{errors.start.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="datetime-local"
                {...register("end", { required: "End time is required" })}
                className="w-full"
              />
              {errors.end && (
                <span className="text-sm text-red-500">{errors.end.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder</label>
            <Select value={selectedReminder.toString()} onValueChange={(value) => setSelectedReminder(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reminder" />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-gray-900" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isEditing && onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
                className="mr-auto"
              >
                Delete Event
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};