// Schedules browser notifications for tasks that have a reminder_at timestamp
// in the near future. Timers are re-computed whenever the task list changes.

const scheduledTimers = new Map(); // taskId -> timeoutId
const MAX_DELAY_MS = 24 * 60 * 60 * 1000; // don't schedule more than 24h out

export function requestNotificationPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function clearAll() {
  scheduledTimers.forEach((timeoutId) => clearTimeout(timeoutId));
  scheduledTimers.clear();
}

export function scheduleReminders(tasks) {
  clearAll();

  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }

  const now = Date.now();

  tasks.forEach((task) => {
    if (task.completed || !task.reminder_at) return;
    const fireAt = new Date(task.reminder_at).getTime();
    const delay = fireAt - now;
    if (delay <= 0 || delay > MAX_DELAY_MS) return;

    const timeoutId = setTimeout(() => {
      try {
        new Notification(`Reminder: ${task.title}`, {
          body: task.time
            ? `Due at ${task.time} on ${task.date}`
            : `Due on ${task.date}`,
          tag: `task-${task.id}`,
        });
      } catch {
        // Notification constructor can throw in some contexts (e.g. service worker only); ignore.
      }
      scheduledTimers.delete(task.id);
    }, delay);

    scheduledTimers.set(task.id, timeoutId);
  });
}
