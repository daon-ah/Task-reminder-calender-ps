import React from "react";
import Calendar from "../components/Calendar.jsx";

export default function CalendarPage() {
  return (
    <div className="page page--calendar">
      <div className="page__intro">
        <h1>Calendar</h1>
        <p>Click a day to add a task, or click an existing task to edit it.</p>
      </div>
      <Calendar />
    </div>
  );
}
