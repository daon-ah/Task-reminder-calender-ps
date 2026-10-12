import React from "react";
import { useTasks } from "../context/TasksContext.jsx";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TaskCard({ task }) {
  const { toggleTaskComplete, removeTask, openModal } = useTasks();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) {
      removeTask(task.id);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleTaskComplete(task.id, !task.completed);
  };

  return (
    <article
      className={`task-card task-card--${task.priority} ${task.completed ? "task-card--done" : ""} ${
        task.overdue ? "task-card--overdue" : ""
      }`}
      onClick={() => openModal(task)}
    >
      <button
        className="task-card__check"
        onClick={handleToggle}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        type="button"
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-card__body">
        <h3 className="task-card__title">{task.title}</h3>
        {task.description ? <p className="task-card__desc">{task.description}</p> : null}
        <div className="task-card__meta">
          <span className="task-card__date">{formatDate(task.date)}</span>
          {task.time ? <span className="task-card__time">{task.time}</span> : null}
          {task.overdue ? <span className="task-card__flag">Overdue</span> : null}
        </div>
      </div>

      <button className="task-card__delete" onClick={handleDelete} aria-label="Delete task" type="button">
        ×
      </button>
    </article>
  );
}
