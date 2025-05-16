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

function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").innerText = question.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  question.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => submitAnswer(option);
    optionsContainer.appendChild(button);
  });
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
          document.getElementById("question").innerText = "Quiz Finished!";
          document.getElementById("options").innerHTML = "";
        }
      }, 1000);
    });
}
