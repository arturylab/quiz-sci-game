# 📋 Project Requirements – Quiz Sci Game

---

## ✅ Functional Requirements

- Display science-related multiple-choice quiz questions in a web interface.
- Dynamically load questions and options from a structured `questions.json` file.
- Capture user responses and validate them in the backend.
- Provide immediate feedback (correct/incorrect) for each answer.
- Track and display the user's current score in real time.
- Allow seamless extension with additional questions without recompiling or rebuilding.

---

## ⚙️ Technical Requirements

- Python 3.11+
- Docker (for deployment and environment isolation)
- HTML, CSS, JavaScript (for frontend)
- Flask (Python backend)
- Flask-CORS (for local development frontend-backend communication)

---

## 🔜 Planned / Optional Features

- ⏱ Timer per question
- 👤 User system (track individual scores or sessions)
- 💾 Persistent storage using SQLite or PostgreSQL
- 💡 Tips or hints per question
- 📊 Score statistics and visual feedback (charts/graphs)
- 🧩 Admin-friendly question editor (UI or CLI)
- 🌍 Internationalization / multilingual support

---

## ❌ Removed Requirements

- ❌ C integration (initially used for answer validation)  
  → Now replaced by dynamic logic handled in Python for easier extensibility and maintenance.
