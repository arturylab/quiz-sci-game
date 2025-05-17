# backend/teacher_tools/generate_exams.py

import csv
import json
import random
import os

# === CONFIG ===
TOTAL_QUESTIONS = 20
DISTRIBUTION = {
    "math": 0.4,
    "physics": 0.25,
    "chemistry": 0.15,
    "biology": 0.10,
    "cs": 0.10
}

STUDENTS_CSV = os.path.join(os.path.dirname(__file__), "students.csv")
EXAMS_DIR = os.path.join(os.path.dirname(__file__), "exams")
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "credentials.json")
QUESTIONS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "questions.json")

# === VALIDATION ===
EXPECTED_HEADERS = ["student_id", "full_name"]

if not os.path.exists(STUDENTS_CSV):
    print(f"❌ File not found: {STUDENTS_CSV}")
    exit(1)

with open(STUDENTS_CSV, newline="") as f:
    reader = csv.DictReader(f)
    headers = reader.fieldnames

    if headers != EXPECTED_HEADERS:
        print(f"❌ Invalid headers. Expected: {EXPECTED_HEADERS}, Found: {headers}")
        exit(1)

    seen_ids = set()
    students = []
    row_count = 0

    for row in reader:
        row_count += 1
        student_id = row.get("student_id", "").strip()
        full_name = row.get("full_name", "").strip()

        if not student_id or not full_name:
            print(f"❌ Row {row_count} has empty fields: {row}")
            continue

        if student_id in seen_ids:
            print(f"❌ Duplicate student ID found: {student_id}")
            continue

        seen_ids.add(student_id)
        students.append({"student_id": student_id, "full_name": full_name})

    if row_count == 0:
        print("⚠️ The file contains no student records.")
        exit(1)
    else:
        print(f"✅ Validation successful: {len(students)} students loaded.")

# === LOAD QUESTIONS ===
with open(QUESTIONS_FILE, "r") as f:
    all_questions = json.load(f)

# Group questions by category
categories = {
    "math": [],
    "physics": [],
    "chemistry": [],
    "biology": [],
    "cs": []
}

for q in all_questions:
    qid = q["id"]
    if qid < 40:
        categories["math"].append(q)
    elif qid < 65:
        categories["physics"].append(q)
    elif qid < 80:
        categories["chemistry"].append(q)
    elif qid < 90:
        categories["biology"].append(q)
    else:
        categories["cs"].append(q)

# Create output directory
os.makedirs(EXAMS_DIR, exist_ok=True)

# Generate exams and credentials
user_data = []

for student in students:
    student_id = student["student_id"]
    full_name = student["full_name"]
    username = student_id
    password = f"pass{random.randint(1000,9999)}"

    exam = []
    for subject, ratio in DISTRIBUTION.items():
        count = round(TOTAL_QUESTIONS * ratio)
        exam += random.sample(categories[subject], count)

    with open(os.path.join(EXAMS_DIR, f"{username}.json"), "w") as f:
        json.dump(exam, f, indent=2)

    user_data.append({
        "student_id": student_id,
        "full_name": full_name,
        "username": username,
        "password": password
    })

with open(CREDENTIALS_FILE, "w") as f:
    json.dump(user_data, f, indent=2)

print("✅ Exams and credentials generated successfully.")
