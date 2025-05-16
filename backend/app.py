import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load questions from questions.json
with open(os.path.join(os.path.dirname(__file__), "questions.json")) as f:
    questions = json.load(f)

@app.route("/questions", methods=["GET"])
def get_questions():
    # Return questions without answers
    public_questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        } for q in questions
    ]
    return jsonify(public_questions)

@app.route("/validate", methods=["POST"])
def validate_answer():
    data = request.get_json()
    answer = data.get("answer", "")
    question_id = data.get("question_id", -1)

    try:
        correct = questions[question_id]["answer"]
    except (IndexError, KeyError):
        return jsonify({"error": "Invalid question ID"}), 400

    return jsonify({
        "correct": answer.strip() == correct,
        "question_id": question_id
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
