export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  reminder?: number;
}

export interface EventFormData {
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  reminder?: number;
}