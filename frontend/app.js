let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let loggedInUser = null; 
let userExamResponses = []; // Array to store { question_id, is_correct }

function handleLogin() {
  const usernameInput = document.getElementById("username").value; // Renamed to avoid conflict with global
  const password = document.getElementById("password").value;
  const loginFeedback = document.getElementById("login-feedback");
  loginFeedback.textContent = ""; 

  if (!usernameInput || !password) {
    loginFeedback.textContent = "Please enter username and password.";
    return;
  }

  fetch("http://localhost:5001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: usernameInput, password }),
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error || "Login failed") });
      }
      return res.json();
    })
    .then(data => {
      if (data.role === "admin") {
        loggedInUser = data.username; // Store admin username
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("quiz-screen").style.display = "none"; // Ensure quiz is hidden
        document.getElementById("admin-stats-screen").style.display = "block";
        loadAdminStats();
      } else if (data.role === "student") {
        questions = data.questions; 
        if (questions && questions.length > 0) {
          loggedInUser = data.username; 
          userExamResponses = []; 
          document.getElementById("login-screen").style.display = "none";
          document.getElementById("admin-stats-screen").style.display = "none"; // Ensure admin is hidden
          document.getElementById("quiz-screen").style.display = "block";
          document.getElementById("quiz-screen").innerHTML = ` 
              <h1 id="quiz-title">Science Quiz</h1>
              <div id="quiz-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                  <strong>Question: </strong><span id="question-count">1 / 100</span>
                </div>
                <div>
                  <strong>Score: </strong><span id="score">0</span>
                </div>
              </div>
              <div id="question-box">
                <p id="question">Loading question...</p>
                <div id="options"></div>
              </div>
              <div id="feedback"></div>`;
          currentQuestionIndex = 0; 
          score = 0; 
          showQuestion();
        } else {
          loginFeedback.textContent = "No questions found for this exam.";
        }
      } else {
        loginFeedback.textContent = "Unknown role received from server.";
      }
    })
    .catch(error => {
      loginFeedback.textContent = error.message; 
      console.error("Login error:", error);
    });
}

function loadAdminStats() {
  const statsContainer = document.getElementById("stats-table-container");
  statsContainer.innerHTML = "<p>Loading statistics...</p>";

  fetch("http://localhost:5001/admin/stats")
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message || "Failed to load stats") });
      }
      return res.json();
    })
    .then(data => {
      if (data.message) { // Handle "No exam results found yet."
        statsContainer.innerHTML = `<p>${data.message}</p>`;
        return;
      }
      if (Array.isArray(data) && data.length > 0) {
        let tableHTML = `
          <table border="1" style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Username</th>
                <th>Total Score</th>
                <th>Total Questions</th>
                <th>Math</th>
                <th>Physics</th>
                <th>Chemistry</th>
                <th>Biology</th>
                <th>CS</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
        `;
        data.forEach(result => {
          tableHTML += `
            <tr>
              <td>${result.username}</td>
              <td>${result.total_score}</td>
              <td>${result.total_questions_in_exam}</td>
              <td>${result.scores_by_category.math} / ${result.questions_per_category_in_exam.math}</td>
              <td>${result.scores_by_category.physics} / ${result.questions_per_category_in_exam.physics}</td>
              <td>${result.scores_by_category.chemistry} / ${result.questions_per_category_in_exam.chemistry}</td>
              <td>${result.scores_by_category.biology} / ${result.questions_per_category_in_exam.biology}</td>
              <td>${result.scores_by_category.cs} / ${result.questions_per_category_in_exam.cs}</td>
              <td>${new Date(result.timestamp).toLocaleString()}</td>
            </tr>
          `;
        });
        tableHTML += `</tbody></table>`;
        statsContainer.innerHTML = tableHTML;
      } else {
        statsContainer.innerHTML = "<p>No exam results found or data is not in expected format.</p>";
      }
    })
    .catch(error => {
      statsContainer.innerHTML = `<p>Error loading statistics: ${error.message}</p>`;
      console.error("Error fetching admin stats:", error);
    });
}

function getSectionName(id) {
  if (id < 40) return "Math";
  if (id < 65) return "Physics";
  if (id < 80) return "Chemistry";
  if (id < 90) return "Biology";
  return "CS"; // Computer Science
}

function startQuiz() { // This function might be redundant if login directly starts the quiz
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  showQuestion();
}

function showQuestion() {
  if (questions.length === 0) {
    // Handle case where questions might not be loaded (e.g., after failed login)
    document.getElementById("question").innerHTML = "No questions loaded. Please log in.";
    document.getElementById("options").innerHTML = "";
    return;
  }
  const question = questions[currentQuestionIndex];

  document.getElementById("question").innerHTML = question.question;
  document.getElementById("question-count").textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
  document.getElementById("score").textContent = score;
  document.getElementById("quiz-title").textContent = `Science Quiz (${getSectionName(question.id)} Section)`;


  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  const section = getSectionName(question.id).toLowerCase();

  question.options.forEach(option => {
    const button = document.createElement("button");
    button.innerHTML = option;
    button.className = section;
    button.onclick = () => submitAnswer(option);
    optionsContainer.appendChild(button);
  });

  if (window.MathJax) MathJax.typesetPromise();
}


function submitAnswer(answer) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  fetch("http://localhost:5001/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question_id: question.id,
      answer: answer
    })
  })
  .then(res => res.json())
  .then(data => {
    userExamResponses.push({ question_id: question.id, is_correct: data.correct }); // Store result

    if (data.correct) {
      feedback.textContent = "Correct! 🎉";
      feedback.className = "correct";
      score++;
    } else {
      feedback.textContent = "Incorrect. Try the next one!";
      feedback.className = "incorrect";
    }
    document.getElementById("score").textContent = score;

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      setTimeout(() => {
        showQuestion();
        feedback.textContent = ""; 
        feedback.className = "";
      }, 1000);
    } else {
      setTimeout(() => {
        showResults();
        feedback.textContent = "";
        feedback.className = "";
      }, 1000);
    }
  })
  .catch(error => {
    console.error("Validation error:", error);
    feedback.textContent = "Error validating answer.";
    feedback.className = "incorrect";
  });
}

function showResults() {
  document.getElementById("quiz-screen").innerHTML = `
    <h2>Quiz Completed 🎉</h2>
    <p>Your final score is <strong>${score}</strong> out of <strong>${questions.length}</strong>.</p>
    <button onclick="logoutAndReset()">Logout</button> 
  `; 
  
  if (loggedInUser) {
    fetch("http://localhost:5001/complete_exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        username: loggedInUser,
        responses: userExamResponses // Send all responses
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Exam completion and results submission:", data.message);
    })
    .catch(error => {
      console.error("Error submitting exam results:", error);
    });
  }
}

function logoutAndReset() {
  questions = [];
  currentQuestionIndex = 0;
  score = 0;
  loggedInUser = null;  
  userExamResponses = [];  
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("admin-stats-screen").style.display = "none"; // Hide admin screen on logout
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("username").value = ""; 
  document.getElementById("password").value = ""; 
  document.getElementById("login-feedback").textContent = "";
  // Reset quiz-screen content in case it was showing results or admin screen was active
   document.getElementById("quiz-screen").innerHTML = ` 
    <h1 id="quiz-title">Science Quiz</h1>
    <div id="quiz-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <strong>Question: </strong><span id="question-count">1 / 100</span>
      </div>
      <div>
        <strong>Score: </strong><span id="score">0</span>
      </div>
    </div>
    <div id="question-box">
      <p id="question">Loading question...</p>
      <div id="options"></div>
    </div>
    <div id="feedback"></div>`;
}
