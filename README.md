# Task Reminder Calendar

A full-stack task and reminder calendar web application built with a React (Vite) frontend, Flask REST API backend, and SQLite database.

Repository: [https://github.com/daon-ah/Task-reminder-calender-ps](https://github.com/daon-ah/Task-reminder-calender-ps)

---

## Project Structure

```
task-reminder-calendar/
├── backend/
│   ├── app.py                  # Flask app entrypoint
│   ├── config.py               # Database and server configuration
│   ├── database.py             # SQLAlchemy instance setup
│   ├── models/
│   │   └── task.py             # Task data model
│   ├── routes/
│   │   └── task_routes.py      # CRUD REST API routes
│   ├── services/
│   │   └── reminder_service.py # Reminder calculation logic
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, TaskCard, TaskModal, Calendar
│   │   ├── context/            # TasksContext state management
│   │   ├── pages/              # Home (Dashboard), CalendarPage
│   │   ├── services/           # Axios/Fetch API client
│   │   ├── utils/              # Reminder & notification utilities
│   │   ├── App.jsx             # Main routing and layout
│   │   ├── index.css           # Global application styles
│   │   └── main.jsx            # React root entry
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy
├── .gitignore
└── README.md
```

---

## Features

- **Interactive Calendar View**: Month calendar view powered by FullCalendar. Click any date to create a task, or click an existing event to view and edit details.
- **Task Management**: Full CRUD operations (create, view, update, delete, toggle completion).
- **Dashboard Overview**: Categorized views for **Today**, **Overdue**, and **Upcoming** tasks.
- **Priorities & Status**: Low, Medium, and High priority flags with color-coded badges.
- **Search & Filter**: Real-time filtering by priority, completion status, or keywords.
- **Client-Side Reminders**: In-browser notifications scheduled based on `reminder_minutes` before a task's due time.

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ & npm

---

### Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows (PowerShell / Command Prompt)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python app.py
   ```
   The Flask API will start on `http://localhost:5000`. The SQLite database (`tasks.db`) will be generated automatically on first run.

---

### Frontend Setup

1. Open another terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` and automatically proxies `/api/*` requests to the Flask server on `http://localhost:5000`.

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List tasks (supports `search`, `priority`, `completed`, `start`, `end` query params) |
| `GET` | `/api/tasks/<id>` | Get details for a specific task |
| `GET` | `/api/tasks/date/<YYYY-MM-DD>` | Get tasks scheduled on a given date |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/<id>` | Update an existing task |
| `DELETE` | `/api/tasks/<id>` | Delete a task |
| `PATCH` | `/api/tasks/<id>/complete` | Toggle or set task completion status |

### Task Payload Schema
```json
{
  "title": "Submit quarterly report",
  "description": "Finalize draft and email to team lead",
  "date": "2026-10-15",
  "time": "17:00",
  "priority": "medium",
  "completed": false,
  "reminder_minutes": 10
}
```

---

## License

This project is licensed under the MIT License.
