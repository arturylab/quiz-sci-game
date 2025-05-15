# Development Plan

## Phase 1: Planning & Documentation
- [x] Define vision and key skills.
- [x] Create folder and file structure.
- [x] Document project goals and flow.

## Phase 2: Frontend Prototyping
- [ ] Create `index.html` with basic layout.
- [ ] Add hardcoded questions (no backend yet).
- [ ] Add a button to submit answers.

## Phase 3: Python Backend
- [ ] Create Flask or FastAPI endpoint `/validate`.
- [ ] Handle user answers from JS fetch POST.
- [ ] Connect to C code from Python.

## Phase 4: C Logic
- [ ] Write `logic.c` to process answers and calculate score.
- [ ] Compile and test the program manually.

## Phase 5: Full Integration
- [ ] Validate full flow: question → answer → result.
- [ ] Display feedback and accumulated score.

## Phase 6: Docker Container
- [ ] Write `Dockerfile`.
- [ ] Test running the app in a container.
- [ ] Add `docker-compose.yml` if needed.

## Phase 7 (Optional): Enhancements
- [ ] Load questions from a JSON file.
- [ ] Add a countdown timer.
- [ ] Implement a simple score history or login system.
