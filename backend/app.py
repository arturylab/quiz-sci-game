from flask import Flask, request, jsonify
from flask_cors import CORS
import ctypes

app = Flask(__name__)
CORS(app)

# Load compiled library
import os
lib_path = os.path.join(os.path.dirname(__file__), "liblogic.so")
lib = ctypes.CDLL(lib_path)


# Define argument and return types
lib.validate_answer.argtypes = [ctypes.c_char_p]
lib.validate_answer.restype = ctypes.c_int

@app.route("/validate", methods=["POST"])
def validate_answer():
    data = request.get_json()
    answer = data.get("answer", "")
    
    # Convert answer to bytes for C
    answer_bytes = answer.encode("utf-8")
    
    # Call C function
    is_correct = lib.validate_answer(answer_bytes)

    return jsonify({
        "correct": bool(is_correct),
        "correct_answer": "H2O"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
