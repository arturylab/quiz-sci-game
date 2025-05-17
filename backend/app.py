import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime # Import datetime for timestamp

app = Flask(__name__)
CORS(app)

# Load general questions (if still needed for other purposes)
# For student exams, we'll load them on demand after login.
with open(os.path.join(os.path.dirname(__file__), "questions.json")) as f:
    all_questions_data = json.load(f) # Renamed to avoid conflict

# Load student credentials
credentials_path = os.path.join(os.path.dirname(__file__), "teacher_tools", "credentials.json")
with open(credentials_path) as f:
    student_credentials = json.load(f)

# Path to exams directory
exams_dir = os.path.join(os.path.dirname(__file__), "teacher_tools", "exams")

# Path for exam completion status
EXAM_STATUS_FILE = os.path.join(os.path.dirname(__file__), "teacher_tools", "exam_status.json")
EXAM_RESULTS_FILE = os.path.join(os.path.dirname(__file__), "teacher_tools", "exam_results.json")

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin1234"

def load_exam_status():
    if not os.path.exists(EXAM_STATUS_FILE):
        return {}
    with open(EXAM_STATUS_FILE, "r") as f:
        return json.load(f)

def save_exam_status(status_data):
    with open(EXAM_STATUS_FILE, "w") as f:
        json.dump(status_data, f, indent=2)

def load_exam_results():
    if not os.path.exists(EXAM_RESULTS_FILE):
        return []
    with open(EXAM_RESULTS_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError: # Handle empty or invalid JSON
            return []

def save_exam_results(results_data):
    with open(EXAM_RESULTS_FILE, "w") as f:
        json.dump(results_data, f, indent=2)

def get_category_by_id(question_id):
    # This logic should ideally be centralized or derived from question data source
    # Replicating the logic from generate_exams.py for now
    if question_id < 40: return "math"
    elif question_id < 65: return "physics"
    elif question_id < 80: return "chemistry"
    elif question_id < 90: return "biology"
    else: return "cs"

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Check for Admin Login
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"role": "admin", "username": username})

    # Find student user
    user = None
    for cred in student_credentials:
        if cred["username"] == username and cred["password"] == password:
            user = cred
            break
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check if student exam is already completed
    exam_status = load_exam_status()
    if exam_status.get(username) == True:
        return jsonify({"error": "Exam already completed. Re-attempts are not allowed."}), 403

    # Load student's specific exam
    exam_file_path = os.path.join(exams_dir, f"{username}.json")
    if not os.path.exists(exam_file_path):
        return jsonify({"error": "Exam not found for this user"}), 404
        
    with open(exam_file_path) as f:
        exam_questions = json.load(f)
        
    return jsonify({"role": "student", "username": username, "questions": exam_questions})


@app.route("/admin/stats", methods=["GET"])
def get_admin_stats():
    # In a real application, you'd protect this route, e.g., require admin session/token
    results = load_exam_results()
    if not results:
        return jsonify({"message": "No exam results found yet."})
    return jsonify(results)

@app.route("/complete_exam", methods=["POST"])
def complete_exam():
    data = request.get_json()
    username = data.get("username")
    submitted_responses = data.get("responses") # Array of {question_id, is_correct}

    if not username or submitted_responses is None:
        return jsonify({"error": "Username and responses required"}), 400
    
    user_exists = any(cred["username"] == username for cred in student_credentials)
    if not user_exists:
        return jsonify({"error": "User not found"}), 404

    # Mark exam as completed (prevents re-attempts)
    exam_status = load_exam_status()
    if exam_status.get(username) == True: # Check if already marked as completed by a previous call
         # Optionally, you could decide if re-submitting results is allowed or an error
        pass # Allow results to be re-calculated/updated if needed, or return error
    exam_status[username] = True
    save_exam_status(exam_status)

    # Calculate results
    scores_by_category = {"math": 0, "physics": 0, "chemistry": 0, "biology": 0, "cs": 0}
    questions_per_category_in_exam = {"math": 0, "physics": 0, "chemistry": 0, "biology": 0, "cs": 0}
    
    # Load the student's actual exam to count questions per category
    student_exam_file_path = os.path.join(exams_dir, f"{username}.json")
    if not os.path.exists(student_exam_file_path):
        return jsonify({"error": "Exam file not found for this user, cannot save results."}), 404
    
    with open(student_exam_file_path, "r") as f:
        student_exam_questions = json.load(f)

    for question_in_exam in student_exam_questions:
        category = get_category_by_id(question_in_exam["id"])
        if category in questions_per_category_in_exam:
            questions_per_category_in_exam[category] += 1

    total_score = 0
    for response in submitted_responses:
        question_id = response.get("question_id")
        is_correct = response.get("is_correct")
        
        if question_id is not None and is_correct is not None:
            category = get_category_by_id(question_id)
            if category in scores_by_category and is_correct:
                scores_by_category[category] += 1
                total_score +=1
    
    result_entry = {
        "username": username,
        "total_score": total_score,
        "total_questions_in_exam": len(student_exam_questions),
        "scores_by_category": scores_by_category,
        "questions_per_category_in_exam": questions_per_category_in_exam,
        "timestamp": datetime.datetime.now().isoformat() + "Z"
    }

    all_results = load_exam_results()
    # Remove previous results for the same user, if any, to avoid duplicates
    all_results = [r for r in all_results if r.get("username") != username]
    all_results.append(result_entry)
    save_exam_results(all_results)
    
    return jsonify({"message": "Exam marked as completed and results recorded."}), 200

@app.route("/questions", methods=["GET"])
def get_questions():
    # This endpoint might be for general public access or admin.
    # For students, questions are now served via /login.
    public_questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        } for q in all_questions_data
    ]
    return jsonify(public_questions)

@app.route("/validate", methods=["POST"])
def validate_answer():
    data = request.get_json()
    answer = data.get("answer", "")
    question_id = data.get("question_id", -1)

    # Validation still uses the main question bank based on ID
    # This assumes IDs in personalized exams map to all_questions_data
    correct_answer_obj = next((q for q in all_questions_data if q["id"] == question_id), None)

    if not correct_answer_obj:
        return jsonify({"error": "Invalid question ID"}), 400
    
    correct = correct_answer_obj["answer"]

    return jsonify({
        "correct": answer.strip() == correct,
        "question_id": question_id
        # Consider returning student_id here if you implement session management
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
