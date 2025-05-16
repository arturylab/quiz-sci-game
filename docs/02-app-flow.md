# 🔄 Application Flow – Quiz Sci Game

This document describes the runtime flow of the application, from loading questions to submitting answers and receiving feedback.

---

## 🌐 High-Level Flow

1. The user opens the web interface (HTML/JS).
2. JavaScript fetches available quiz questions from the backend via a GET request to `/questions`.
3. The user selects an answer by clicking a button.
4. JavaScript sends the selected answer and the associated question ID to the backend via a POST request to `/validate`.
5. Python matches the answer against the correct one (from `questions.json`).
6. The backend responds with a boolean indicating whether the answer is correct.
7. The frontend updates the UI:
     - Shows feedback (✅ Correct / ❌ Incorrect)
     - Updates the current score

---

## 🖼️ Flow Diagram (text-based)

```
[Frontend: HTML/CSS/JS]
↓
GET /questions
↓
[Python Flask API] ← questions.json
↓
[User selects answer]
↓
POST /validate (question_id + answer)
↓
[Flask validates against correct answer]
↓
[Response: correct/incorrect]
↓
[Frontend displays result + updates score]
```

---

## 🔁 Benefits of This Flow

- No need to recompile or rebuild the backend to change quiz content.
- Entirely dynamic: all content is loaded at runtime.
- Clean separation of concerns between frontend, backend, and data.
- Ready for future features like tips, difficulty levels, and stats.
