import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarEvent } from '../types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
      updateEvent: (updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        })),
      deleteEvent: (eventId) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        })),
    }),
    {
      name: 'calendar-storage',
    }
  )
);