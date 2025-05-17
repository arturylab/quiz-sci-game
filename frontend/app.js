let questions = [];
let currentQuestionIndex = 0;
let score = 0;

window.onload = () => {
  fetch("http://localhost:5001/questions")
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });
};

function getSectionName(id) {
  if (id < 40) return "Math";
  if (id < 65) return "Physics";
  if (id < 80) return "Chemistry";
  if (id < 90) return "Biology";
  return "CS"; // Computer Science
}

function startQuiz() {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  showQuestion();  // o la función que inicia tu flujo actual
}

function showQuestion() {
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
    button.className = section;  // set class based on section
    button.onclick = () => submitAnswer(option);
    optionsContainer.appendChild(button);
  });

  if (window.MathJax) MathJax.typesetPromise();
}


function submitAnswer(answer) {
  const question = questions[currentQuestionIndex];

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
      if (data.correct) {
        document.getElementById("feedback").innerText = "✅ Correct!";
        score++;
      } else {
        document.getElementById("feedback").innerText = "❌ Incorrect!";
      }

      document.getElementById("score").innerText = score;

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          showQuestion();
          document.getElementById("feedback").innerText = "";
        } else {
          // document.getElementById("question").innerText = "Quiz Finished!";
          // document.getElementById("options").innerHTML = "";
          showResults();
        }
      }, 1000);
    });
}

function showResults() {
  document.getElementById("quiz-screen").innerHTML = `
    <h2>Quiz Completed 🎉</h2>
    <p>Your final score is <strong>${score}</strong> out of <strong>${questions.length}</strong>.</p>
    <button onclick="location.reload()">Try Again</button>
  `;
}
