import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import TaskModal from "./components/TaskModal.jsx";
import Home from "./pages/Home.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";

export default function App() {
  return (
    <TasksProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
      <TaskModal />
    </TasksProvider>
  );
}
