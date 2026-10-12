import React from "react";

const PRIORITIES = [
  { value: "", label: "All priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function Sidebar({ filters, onFilterChange, stats }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <label className="field-label" htmlFor="search">
          Search
        </label>
        <input
          id="search"
          type="text"
          className="input"
          placeholder="Find a task…"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="sidebar__section">
        <label className="field-label" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className="input"
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar__section">
        <label className="field-label">Status</label>
        <div className="chip-row">
          {["all", "active", "completed"].map((status) => (
            <button
              key={status}
              className={`chip ${filters.status === status ? "chip--active" : ""}`}
              onClick={() => onFilterChange({ ...filters, status })}
              type="button"
            >
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar__stamp-stack">
        <div className="stamp">
          <span className="stamp__count">{stats.today}</span>
          <span className="stamp__label">Today</span>
        </div>
        <div className="stamp stamp--warn">
          <span className="stamp__count">{stats.overdue}</span>
          <span className="stamp__label">Overdue</span>
        </div>
        <div className="stamp stamp--muted">
          <span className="stamp__count">{stats.upcoming}</span>
          <span className="stamp__label">Upcoming</span>
        </div>
      </div>
    </aside>
  );
}
