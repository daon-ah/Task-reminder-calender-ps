import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TasksContext.jsx";

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  priority: "medium",
  reminder_minutes: 10,
  completed: false,
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskModal() {
  const { modalState, closeModal, addTask, editTask, removeTask } = useTasks();
  const { open, task, defaultDate } = modalState;
  const isEditing = Boolean(task);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          title: task.title || "",
          description: task.description || "",
          date: task.date || todayStr(),
          time: task.time || "",
          priority: task.priority || "medium",
          reminder_minutes: task.reminder_minutes ?? 10,
          completed: Boolean(task.completed),
        });
      } else {
        setForm({ ...EMPTY_FORM, date: defaultDate || todayStr() });
      }
      setError("");
    }
  }, [open, task, defaultDate]);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.date) {
      setError("Date is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        reminder_minutes: Number(form.reminder_minutes) || 0,
        time: form.time || null,
      };
      if (isEditing) {
        await editTask(task.id, payload);
      } else {
        await addTask(payload);
      }
      closeModal();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (window.confirm(`Delete "${task.title}"?`)) {
      await removeTask(task.id);
      closeModal();
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{isEditing ? "Edit task" : "New task"}</h2>
          <button className="modal__close" onClick={closeModal} aria-label="Close" type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          {error ? <div className="form-error">{error}</div> : null}

          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="input"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Submit quarterly report"
            autoFocus
          />

          <label className="field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input textarea"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Optional details…"
            rows={3}
          />

          <div className="form-row">
            <div>
              <label className="field-label" htmlFor="date">
                Date
              </label>
              <input id="date" type="date" className="input" value={form.date} onChange={handleChange("date")} />
            </div>
            <div>
              <label className="field-label" htmlFor="time">
                Time
              </label>
              <input id="time" type="time" className="input" value={form.time} onChange={handleChange("time")} />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="field-label" htmlFor="priority">
                Priority
              </label>
              <select id="priority" className="input" value={form.priority} onChange={handleChange("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="reminder">
                Remind (min before)
              </label>
              <input
                id="reminder"
                type="number"
                min="0"
                className="input"
                value={form.reminder_minutes}
                onChange={handleChange("reminder_minutes")}
              />
            </div>
          </div>

          {isEditing ? (
            <label className="checkbox-row">
              <input type="checkbox" checked={form.completed} onChange={handleChange("completed")} />
              Mark as completed
            </label>
          ) : null}

          <div className="modal__footer">
            {isEditing ? (
              <button type="button" className="btn btn--danger" onClick={handleDelete}>
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="modal__footer-actions">
              <button type="button" className="btn btn--ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Saving…" : isEditing ? "Save changes" : "Add task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
