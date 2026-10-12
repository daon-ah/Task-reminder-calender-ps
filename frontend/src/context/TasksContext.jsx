import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../services/taskApi";
import { requestNotificationPermission, scheduleReminders } from "../utils/reminders";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ open: false, task: null, defaultDate: null });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    refresh();
  }, [refresh]);

  useEffect(() => {
    scheduleReminders(tasks);
  }, [tasks]);

  const addTask = useCallback(async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [...prev, created]);
    return created;
  }, []);

  const editTask = useCallback(async (id, payload) => {
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskComplete = useCallback(async (id, completed) => {
    const updated = await api.toggleComplete(id, completed);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const openModal = useCallback((task = null, defaultDate = null) => {
    setModalState({ open: true, task, defaultDate });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ open: false, task: null, defaultDate: null });
  }, []);

  const value = {
    tasks,
    loading,
    error,
    refresh,
    addTask,
    editTask,
    removeTask,
    toggleTaskComplete,
    modalState,
    openModal,
    closeModal,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}
