# Application Flow

1. User selects an answer on the web (HTML/JS).
2. JavaScript sends the answer to the Python backend via `fetch()` POST.
3. Python runs the C program with the answer as input.
4. The C program evaluates the answer and returns the score/result.
5. Python returns that data to the frontend.
6. Frontend updates the score display and shows feedback.

## Flow Diagram (text-based)

[Frontend HTML/JS]
     ↓
[JavaScript fetch()]
     ↓
[Python Backend API]
     ↓
[Compiled C Program]
     ↓
[Result: Correct/Incorrect + Score]
     ↓
[Display on screen]
