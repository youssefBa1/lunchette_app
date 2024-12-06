import React from "react";

export default function CustomTimeGridEvent({ calendarEvent }) {
  return (
    <div className="bg-orange-300 h-max w-28">
      <div className="flex felx-col ">
        Name: {calendarEvent.clientName}{" "}
        <>
          <br />
        </>{" "}
        {calendarEvent.start}
      </div>
    </div>
  );
}
