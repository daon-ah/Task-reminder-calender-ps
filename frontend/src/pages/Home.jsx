import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useTasks } from "../context/TasksContext.jsx";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const { tasks, loading, error } = useTasks();
  const [filters, setFilters] = useState({ search: "", priority: "", status: "all" });

  const today = todayStr();

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const inTitle = t.title?.toLowerCase().includes(q);
        const inDesc = t.description?.toLowerCase().includes(q);
        if (!inTitle && !inDesc) return false;
      }
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.status === "active" && t.completed) return false;
      if (filters.status === "completed" && !t.completed) return false;
      return true;
    });
  }, [tasks, filters]);

  const todayTasks = filtered.filter((t) => t.date === today);
  const overdueTasks = filtered.filter((t) => t.overdue);
  const upcomingTasks = filtered.filter((t) => t.date > today && !t.overdue);

  const stats = {
    today: tasks.filter((t) => t.date === today && !t.completed).length,
    overdue: tasks.filter((t) => t.overdue).length,
    upcoming: tasks.filter((t) => t.date > today && !t.completed).length,
  };

  return (
    <div className="page page--dashboard">
      <Sidebar filters={filters} onFilterChange={setFilters} stats={stats} />

      <main className="dashboard-content">
        {error ? <div className="banner banner--error">{error}</div> : null}
        {loading ? <div className="banner">Loading tasks…</div> : null}

        <Section title="Today" tasks={todayTasks} empty="Nothing due today. Enjoy the calm." />
        <Section title="Overdue" tasks={overdueTasks} empty="Nothing overdue — you're on top of things." />
        <Section title="Upcoming" tasks={upcomingTasks} empty="No upcoming tasks match your filters." />
      </main>
    </div>
  );
}

function Section({ title, tasks, empty }) {
  return (
    <section className="task-section">
      <div className="task-section__header">
        <h2>{title}</h2>
        <span className="task-section__count">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <p className="task-section__empty">{empty}</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
