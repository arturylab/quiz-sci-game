# 📁 Project Folder Structure – Quiz Sci Game

This document outlines the current file and folder structure of the project after refactoring to use dynamic JSON-based questions (no C code required).

---

## 🗂 Updated Structure

```plaintext
quiz-sci-game/
├── backend/
│   ├── app.py               # Python backend (Flask)
│   ├── questions.json       # Dynamic science quiz data
│   ├── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html           # Main UI
│   ├── style.css            # Styling for quiz interface
│   └── app.js               # JavaScript logic (fetch, render, score)
├── docs/
│   ├── 00-project-vision.md
│   ├── 01-requirements.md
│   ├── 02-app-flow.md
│   ├── 03-folder-structure.md
│   └── 04-development-plan.md
├── Dockerfile               # Docker configuration (single-container)
├── README.md                # Project overview
└── .gitignore               # Files and folders to exclude from Git
