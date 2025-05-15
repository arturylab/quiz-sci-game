# Backend – Quiz Science Game

This backend is a Flask application written in Python that communicates with a shared library (`liblogic.so`) written in C. It exposes a `/validate` endpoint to check user answers from the frontend.

---

## 📁 File Structure

```
backend/
├── app.py         # Flask backend app
├── logic.c        # C source code for answer validation
├── liblogic.so    # Compiled shared library
└── README.md      # This documentation file
```

---

## ⚙️ Building the Shared Library (`liblogic.so`)

### Step 1: Create the C file

Filename: `logic.c`

```c
#include <string.h>

// Compares user answer to the correct one
int validate_answer(const char* user_answer) {
    const char* correct = "H2O";
    return strcmp(user_answer, correct) == 0 ? 1 : 0;
}
```

### Step 2: Compile with GCC

Run the following command from inside the `backend/` directory:

```sh
gcc -shared -o liblogic.so -fPIC logic.c
```

This will generate the shared object file `liblogic.so`.

---

## 🐍 Python Integration

In `app.py`, the shared library is loaded using `ctypes`:

```python
import ctypes
import os

# Load the compiled C library
lib_path = os.path.join(os.path.dirname(__file__), "liblogic.so")
lib = ctypes.CDLL(lib_path)

# Define argument and return types
lib.validate_answer.argtypes = [ctypes.c_char_p]
lib.validate_answer.restype = ctypes.c_int
```

---

## 🚀 Running the Backend

From the project root directory (`quiz-sci-game/`), activate the virtual environment and run:

```sh
python3 backend/app.py
```

This will start the development server on port 5000.

---

## 📬 API Endpoint

### `POST /validate`

Validates a science quiz answer.

**Request (JSON):**
```json
{
  "answer": "H2O"
}
```

**Response (JSON):**
```json
{
  "correct": true,
  "correct_answer": "H2O"
}
```
