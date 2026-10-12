from datetime import datetime, timedelta


def get_reminder_datetime(task):
    """
    Returns the datetime at which a browser reminder should fire for a task,
    or None if the task has no date/time set.
    """
    if not task.date or not task.time:
        return None

    try:
        task_dt = datetime.strptime(f"{task.date} {task.time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return None

    minutes_before = task.reminder_minutes or 0
    return task_dt - timedelta(minutes=minutes_before)


def is_overdue(task):
    if task.completed or not task.date:
        return False
    today = datetime.now().strftime("%Y-%m-%d")
    now_time = datetime.now().strftime("%H:%M")
    if task.date < today:
        return True
    if task.date == today and task.time and task.time < now_time:
        return True
    return False


def serialize_with_status(task):
    data = task.to_dict()
    data["overdue"] = is_overdue(task)
    reminder_dt = get_reminder_datetime(task)
    data["reminder_at"] = reminder_dt.isoformat() if reminder_dt else None
    return data
