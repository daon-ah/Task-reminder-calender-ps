from datetime import datetime

from database import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True, default="")
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    time = db.Column(db.String(5), nullable=True)  # HH:MM
    priority = db.Column(db.String(10), nullable=False, default="medium")  # low|medium|high
    completed = db.Column(db.Boolean, nullable=False, default=False)
    reminder_minutes = db.Column(db.Integer, nullable=True, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "time": self.time,
            "priority": self.priority,
            "completed": self.completed,
            "reminder_minutes": self.reminder_minutes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
