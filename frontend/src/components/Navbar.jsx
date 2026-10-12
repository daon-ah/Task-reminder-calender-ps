import React from "react";
import { NavLink } from "react-router-dom";
import { useTasks } from "../context/TasksContext.jsx";

export default function Navbar() {
  const { openModal } = useTasks();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark">◆</span>
        <span className="navbar__title">Docket</span>
      </div>

      <nav className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "navlink navlink--active" : "navlink")}>
          Dashboard
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => (isActive ? "navlink navlink--active" : "navlink")}>
          Calendar
        </NavLink>
      </nav>

      <button className="btn btn--primary" onClick={() => openModal()}>
        + New task
      </button>
    </header>
  );
}
