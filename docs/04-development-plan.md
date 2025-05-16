# 📆 Development Plan – Quiz Sci Game

This document outlines the current and upcoming development goals for the **Quiz Sci Game** project.

---

## ✅ Phase 1: Core Functionality (Completed)

- ✔️ Basic HTML/CSS/JS frontend
- ✔️ Python Flask backend with API endpoints (`/questions`, `/validate`)
- ✔️ Answer validation logic moved from C to Python
- ✔️ Dynamic question loading from `questions.json`
- ✔️ Dockerized backend (single container)
- ✔️ Cross-origin communication enabled with `flask-cors`

---

## 🔄 Phase 2: Extensibility (Current)

🟡 In progress on the `feature/json-driven-quiz` branch

- [x] Remove C integration completely
- [x] Simplify Dockerfile (remove gcc, build tools)
- [x] Clean and document updated architecture
- [ ] Improve frontend rendering flow (loading indicator, error handling)
- [ ] Modularize frontend JS (split concerns)
- [ ] Allow JSON question updates without server restart

---

## 🚀 Phase 3: New Features (Planned)

- 🧠 **Tips per question**: Provide a hint on request (e.g., “Show Hint” button)
- 🧾 **Persistent scoring**: Save results to SQLite/PostgreSQL
- 📊 **Statistics dashboard**:
  - Total attempts
  - Score history
  - Per-question success rates
- 📈 **Graphical data**: Use charts to show performance
- ⏱ **Timer per question**: Limit time per answer
- 👤 **User system**: Track individual performance (optional login)
- 🧩 **Question editor (admin only)**: Create/update `questions.json` visually

---

## 🧪 Experimental Ideas

- 🧠 AI-powered question generation
- 🌍 Internationalization (i18n) support
- 📤 Export results (CSV, PDF)
- 🔐 Secure user sessions (Flask-Login / OAuth)

---

## 🗂 Branch Management

- `main`: Stable version of the game (currently static version)
- `feature/json-driven-quiz`: Dynamic JSON-based refactor (current active branch)
- Future: `feature/db-integration`, `feature/statistics`, `feature/tips`, etc.
