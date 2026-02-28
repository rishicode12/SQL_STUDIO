# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and AI-powered hints.

---

## Features

- **Assignment Listing** — Browse SQL assignments by difficulty (Easy / Medium / Hard)
- **Monaco SQL Editor** — VS Code-quality editor with syntax highlighting, autocomplete, Ctrl+Enter to run
- **Real-time Query Execution** — Queries run against a live PostgreSQL sandbox
- **Schema Viewer** — See table schemas and sample data before writing queries
- **AI Hint System** — Get contextual hints (not solutions) powered by OpenAI GPT-4o-mini
- **Auth System** — Register/login to save query attempts
- **Mobile-first Responsive Design** — Works on 320px → 1400px+

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React.js | Component-based, great ecosystem |
| Styling | Vanilla SCSS | Variables, mixins, nesting, BEM |
| Code Editor | Monaco Editor | Industry-standard, SQL support |
| Backend | Node.js + Express | Fast, non-blocking I/O |
| Sandbox DB | PostgreSQL | Real SQL execution environment |
| Persistence | MongoDB (Atlas) | Flexible schema for assignments/users |
| LLM | OpenAI GPT-4o-mini | Good balance of cost and quality for hints |

---

## Project Structure

```
ciphersqlstudio/
├── backend/
│   ├── config/
│   │   ├── mongodb.js        # MongoDB connection
│   │   ├── postgres.js       # PostgreSQL pool
│   │   ├── seed.sql          # PostgreSQL schema + sample data
│   │   └── seedMongo.js      # MongoDB assignments seed
│   ├── controllers/
│   │   ├── assignmentController.js
│   │   ├── queryController.js
│   │   ├── hintController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/
│   │   ├── Assignment.js     # MongoDB schema
│   │   └── User.js           # MongoDB schema
│   ├── routes/
│   │   ├── assignments.js
│   │   ├── query.js
│   │   ├── hints.js
│   │   └── auth.js
│   ├── services/
│   │   ├── queryValidator.js # SQL sanitization
│   │   └── llmService.js     # OpenAI hint generation
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout/Navbar.jsx
    │   │   ├── AssignmentList/AssignmentList.jsx
    │   │   ├── AssignmentAttempt/
    │   │   │   ├── AssignmentAttempt.jsx  # Main attempt page
    │   │   │   └── SchemaViewer.jsx
    │   │   ├── Results/ResultsPanel.jsx
    │   │   ├── Hints/HintPanel.jsx
    │   │   └── auth/AuthPage.jsx
    │   ├── context/AuthContext.js
    │   ├── services/api.js
    │   ├── styles/
    │   │   ├── abstracts/
    │   │   │   ├── _variables.scss
    │   │   │   └── _mixins.scss
    │   │   ├── layout/_base.scss
    │   │   ├── components/
    │   │   │   ├── _navbar.scss
    │   │   │   ├── _assignment-list.scss
    │   │   │   ├── _assignment-attempt.scss
    │   │   │   ├── _results-panel.scss
    │   │   │   ├── _hint-panel.scss
    │   │   │   ├── _schema-viewer.scss
    │   │   │   ├── _buttons.scss
    │   │   │   ├── _auth.scss
    │   │   │   ├── _editor.scss
    │   │   │   └── _loading.scss
    │   │   └── main.scss
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL (local or cloud)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ciphersqlstudio.git
cd ciphersqlstudio
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
```

**Set up PostgreSQL sandbox:**

```bash
psql -U postgres -d your_database < config/seed.sql
```

**Seed MongoDB assignments:**

```bash
node config/seedMongo.js
```

**Start backend:**

```bash
npm run dev   # development (nodemon)
npm start     # production
```

Backend runs on `http://localhost:5000`

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm start
```

Frontend runs on `http://localhost:3000`

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `PG_HOST` | PostgreSQL host |
| `PG_PORT` | PostgreSQL port |
| `PG_DATABASE` | PostgreSQL database name |
| `PG_USER` | PostgreSQL username |
| `PG_PASSWORD` | PostgreSQL password |
| `OPENAI_API_KEY` | OpenAI API key for hints |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`) |

### Frontend `.env`

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get single assignment |
| POST | `/api/query/execute` | Execute SQL query |
| POST | `/api/hints` | Get AI hint |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/attempts` | Save query attempt (auth required) |

---

## Security

- All user queries are validated and sanitized before execution
- Only `SELECT` and `WITH` statements are allowed
- Dangerous keywords (`DROP`, `DELETE`, `ALTER`, etc.) are blocked
- Each assignment runs in its own PostgreSQL schema (search_path isolation)
- Query execution timeout: 5 seconds
- Rate limiting: 100 req/15min globally, 20 query executions/min
- Passwords hashed with bcrypt
- JWT authentication for protected routes

---

## LLM Hint Engineering

The hint system uses careful prompt engineering to ensure:
- Hints guide students toward the answer without revealing it
- The LLM explains *what concept* to use, not *how to write* the query
- SQL errors are explained in educational terms
- Responses are kept to 2-4 sentences to stay concise

---

## SCSS Architecture

Uses a 7-1 inspired partial structure:
- `abstracts/` — Variables and mixins (no CSS output)
- `layout/` — Base reset and global styles
- `components/` — Per-component styles
- `main.scss` — Entry point that imports all partials

Mobile-first breakpoints: `320px → 641px → 1024px → 1281px`
