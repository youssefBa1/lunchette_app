import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewDay } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "../styles/calendar.css";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useState, useEffect } from "react";
import CustomTimeGridEvent from "./CustomTimeGridEvent";

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewDay()],

    events: [
      {
        id: 1,
        title: "Coffee with John",
        start: "2024-12-05 02:15",
        end: "2024-12-05 02:15",
        description: "dddddddddd",
        clientName: "mme makni",
      },
      {
        id: 2,
        title: "Cd",
        start: "2024-12-05 02:15",
        end: "2024-12-05 02:15",
        description: "dddddddddd",
        clientName: "mme sara",
      },
    ],
    plugins: [eventsService, createEventModalPlugin()],
    locale: "fr-FR",
  });

  const processEvents = (events) => {
    const processedEvents = events.map((event, index, allEvents) => {
      // Check for overlapping events
      const overlappingEvents = allEvents.filter(
        (otherEvent) =>
          otherEvent.id !== event.id &&
          ((otherEvent.start <= event.end && otherEvent.end >= event.start) ||
            (event.start <= otherEvent.end && event.end >= otherEvent.start))
      );

      const overlapIndex = overlappingEvents.findIndex(
        (e) => e.id === event.id
      );
      const overlapCount = overlappingEvents.length + 1;

      return {
        ...event,
        overlapIndex: overlapIndex !== -1 ? overlapIndex : 0,
        overlapCount,
      };
    });

    return processedEvents;
  };

  useEffect(() => {
    // get all events
    eventsService.getAll();
  }, []);

  return (
    <div>
      <ScheduleXCalendar
        calendarApp={calendar}
        customComponents={{
          timeGridEvent: CustomTimeGridEvent,
        }}
      />
    </div>
  );
}

export default CalendarApp;
