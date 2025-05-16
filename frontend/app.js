let score = 0;

function submitAnswer(answer) {
  fetch("http://localhost:5001/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ answer: answer })
  })
  .then(response => response.json())
  .then(data => {
    if (data.correct) {
      document.getElementById("feedback").innerText = "Correct!";
      score += 1;
    } else {
      document.getElementById("feedback").innerText = "Incorrect " + answer + ". Correct answer: " + data.correct_answer;
    }

    document.getElementById("score").innerText = score;
  })
  .catch(error => {
    document.getElementById("feedback").innerText = "Server error!";
    console.error("Error:", error);
  });
}
