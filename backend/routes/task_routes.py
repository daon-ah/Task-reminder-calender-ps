from flask import Blueprint, jsonify, request

from database import db
from models.task import Task
from services.reminder_service import serialize_with_status

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

VALID_PRIORITIES = {"low", "medium", "high"}


def _error(message, status=400):
    return jsonify({"error": message}), status


def _validate_payload(data, partial=False):
    if not partial or "title" in data:
        if not data.get("title") or not str(data.get("title")).strip():
            return "Title is required"
    if not partial or "date" in data:
        if not data.get("date"):
            return "Date is required"
    if "priority" in data and data["priority"] not in VALID_PRIORITIES:
        return f"Priority must be one of {sorted(VALID_PRIORITIES)}"
    return None


@task_bp.route("", methods=["GET"])
def list_tasks():
    query = Task.query

    search = request.args.get("search")
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(Task.title.ilike(like), Task.description.ilike(like))
        )

    priority = request.args.get("priority")
    if priority:
        query = query.filter(Task.priority == priority)

    completed = request.args.get("completed")
    if completed is not None:
        query = query.filter(Task.completed == (completed.lower() == "true"))

    start = request.args.get("start")
    end = request.args.get("end")
    if start:
        query = query.filter(Task.date >= start)
    if end:
        query = query.filter(Task.date <= end)

    tasks = query.order_by(Task.date.asc(), Task.time.asc()).all()
    return jsonify([serialize_with_status(t) for t in tasks])


@task_bp.route("/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(serialize_with_status(task))


@task_bp.route("/date/<string:date_str>", methods=["GET"])
def get_tasks_by_date(date_str):
    tasks = Task.query.filter_by(date=date_str).order_by(Task.time.asc()).all()
    return jsonify([serialize_with_status(t) for t in tasks])


@task_bp.route("", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}
    error = _validate_payload(data)
    if error:
        return _error(error)

    task = Task(
        title=data["title"].strip(),
        description=data.get("description", ""),
        date=data["date"],
        time=data.get("time"),
        priority=data.get("priority", "medium"),
        completed=bool(data.get("completed", False)),
        reminder_minutes=data.get("reminder_minutes", 10),
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(serialize_with_status(task)), 201


@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json(silent=True) or {}
    error = _validate_payload(data, partial=True)
    if error:
        return _error(error)

    for field in ["title", "description", "date", "time", "priority", "reminder_minutes"]:
        if field in data:
            setattr(task, field, data[field])
    if "completed" in data:
        task.completed = bool(data["completed"])

    db.session.commit()
    return jsonify(serialize_with_status(task))


@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted", "id": task_id})


@task_bp.route("/<int:task_id>/complete", methods=["PATCH"])
def toggle_complete(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json(silent=True) or {}
    if "completed" in data:
        task.completed = bool(data["completed"])
    else:
        task.completed = not task.completed
    db.session.commit()
    return jsonify(serialize_with_status(task))
