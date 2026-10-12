import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTasks } from "../context/TasksContext.jsx";

const PRIORITY_COLOR = {
  high: "#C1440E",
  medium: "#C99A2E",
  low: "#4F7942",
};

export default function Calendar() {
  const { tasks, openModal } = useTasks();

  const events = useMemo(
    () =>
      tasks.map((task) => ({
        id: String(task.id),
        title: task.title,
        date: task.date,
        allDay: true,
        backgroundColor: PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.medium,
        borderColor: PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.medium,
        classNames: task.completed ? ["fc-event--done"] : [],
        extendedProps: { task },
      })),
    [tasks]
  );

  return (
    <div className="calendar-wrap">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        events={events}
        dateClick={(info) => openModal(null, info.dateStr)}
        eventClick={(info) => openModal(info.event.extendedProps.task)}
        dayMaxEvents={3}
      />
    </div>
  );
}
