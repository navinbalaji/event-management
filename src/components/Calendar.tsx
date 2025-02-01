import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { EventForm } from "./EventForm";
import { useCalendarStore } from "../store/useCalendarStore";
import { CalendarEvent, EventFormData } from "../types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";

export const Calendar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { toast } = useToast();

  // Handle reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach((event) => {
        if (event.reminder) {
          const reminderTime = new Date(event.start.getTime() - event.reminder * 60000);
          if (Math.abs(reminderTime.getTime() - now.getTime()) < 60000) {
            // Within a minute
            toast({
              title: "Event Reminder",
              description: `${event.title} starts in ${event.reminder} minute(s)`,
            });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events, toast]);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsFormOpen(true);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    const event = events.find((e) => e.id === dropInfo.event.id);
    if (event) {
      const updatedEvent: CalendarEvent = {
        ...event,
        start: dropInfo.event.start,
        end: dropInfo.event.end || dropInfo.event.start,
      };
      updateEvent(updatedEvent);
      toast({
        title: "Event Updated",
        description: "The event has been rescheduled successfully.",
      });
    }
  };

  const handleSubmit = (data: EventFormData) => {
    if (selectedEvent) {
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        ...data,
      };
      updateEvent(updatedEvent);
      toast({
        title: "Event Updated",
        description: "The event has been updated successfully.",
      });
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        ...data,
      };
      addEvent(newEvent);
      toast({
        title: "Event Created",
        description: "Your new event has been created successfully.",
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setIsFormOpen(false);
      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      });
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const event = events.find((e) => e.id === eventInfo.event.id);
    return (
      <div className="flex items-center gap-1 px-1 py-0.5" style={{ backgroundColor: event?.color }}>
        {event?.reminder && <Bell className="h-3 w-3 text-white" />}
        <span className="text-white">{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin,timeGridPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events.map((event) => ({
          ...event,
          backgroundColor: event.color,
          borderColor: event.color,
        }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
      />
      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleSubmit}
        onDelete={selectedEvent ? handleDelete : undefined}
        initialData={selectedEvent || (selectedDate ? { start: selectedDate, end: selectedDate } : undefined)}
        isEditing={!!selectedEvent}
      />
    </div>
  );
};
