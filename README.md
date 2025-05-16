# 🧪 Quiz Sci Game 🎮

Welcome to **Quiz Sci Game**, an interactive, educational quiz application designed to make learning science fun and dynamic! Built with **Python + Flask** on the backend and **HTML/CSS/JavaScript** on the frontend, this project is now powered by flexible, dynamic data loading from a `questions.json` file.

🚀 The app runs inside a lightweight Docker container, making it easy to deploy and extend.

---

## 📚 Features

- ✨ Interactive web-based quiz  
- 📄 Questions loaded from a JSON file (no recompilation needed!)  
- 🧠 Science-based questions with multiple-choice answers  
- ✅ Real-time answer validation  
- 📦 Docker support for easy deployment  
- 🌐 CORS enabled for local frontend-backend communication  
- 💡 Built for extensibility — more features coming soon:
    - 🧩 Tips per question
    - 📊 Statistics and performance tracking
    - 📁 Persistent database storage (SQLite, PostgreSQL)
    - 📈 Data visualization

---

## 🛠️ Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Backend    | Python 3.11, Flask, Flask-CORS  |
| Frontend   | HTML, CSS, JavaScript           |
| Deployment | Docker                          |
| Data       | JSON (`questions.json`)         |

---

## 🚀 Quick Start

1. **Build the Docker image**:

     ```bash
     docker build -t quiz-backend .
     ```

2. **Run the container**:

     ```bash
     docker run -p 5001:5001 quiz-backend
     ```

3. **Open the frontend**:

     Open `frontend/index.html` in your browser and start playing!

---

## 📂 Project Structure

```
quiz-sci-game/
├── backend/
│   ├── app.py               # Flask backend
│   ├── questions.json       # Science questions and answers
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── Dockerfile               # Container configuration
├── README.md
└── docs/                    # Project documentation
```

---

## 🤝 Contributing

We welcome ideas and contributions! Feel free to fork the repo and suggest new features.

---

## 📜 License

MIT License. Feel free to use, modify, and share!