# Seesaw Logic Simulation

Live Demo:  
https://sevvalnr.github.io/seesaw.sevval-nur-kibar/

## Project Overview
This project simulates a physics-based seesaw interaction using pure JavaScript, HTML, and CSS.  
The system calculates torque based on the weight and its distance from the pivot point, then updates the plank’s angle in real time.

---

## Thought Process & Design Decisions

### 1. Separation of Concerns (CSS & JavaScript)
I intentionally separated styling and logic into different files.

- **Decision:** All visual styling is handled in a dedicated CSS file.
- **Reasoning:** This keeps JavaScript focused purely on behavior and calculations, making the physics logic easier to reason about and debug.

---

### 2. Clean Code Structure
Readability and clarity were a priority throughout the project.

- Constants such as `MAX_ANGLE`, `DAMPING_FACTOR`, and `PLANK_LENGTH` are written in **UPPERCASE** to clearly distinguish configuration values from runtime state.
- Functions are kept small and purpose-driven (e.g. torque calculation, UI updates, persistence).

This approach helps prevent tightly coupled logic and makes the simulation easier to extend.

---

### 3. Physics Logic & Simplification

- **Decision:** Torque is calculated using the linear distance from the pivot point.
- **Trade-off:** In real physics, the effective lever arm would change with the plank’s angle (cosine adjustment).  
  I intentionally omitted this to avoid unstable feedback loops and visual jitter.
- **Result:** A smoother and more predictable UI experience, which is more suitable for an interactive simulation.

---

### 4. Animation Stability (Damping)
- **Decision:** Introduced a `DAMPING_FACTOR` when updating the angle.
- **Reasoning:** Without damping, the plank would snap instantly to its new angle.  
  Damping makes the movement feel more natural and visually realistic.

---

### 5. State Management & Unique IDs
- Each weight added to the plank is stored as an object with a unique `id` generated using `Date.now()`.
- **Reasoning:** This allows precise deletion of individual weights without relying on array indices, which can become unreliable when items are added or removed dynamically.

---

### 6. Persistence with LocalStorage
- The simulation state is saved to `localStorage`.
- On page refresh, the previously added weights are restored automatically.
- This improves the overall user experience and demonstrates basic client-side persistence.

---

## AI Usage
- **Designed & implemented manually:**
  - Torque calculation logic
  - State management structure
  - Physics simplification decisions
- **AI-assisted parts:**
  - Debugging specific JavaScript issues
  - Generating random color logic
  - Improving responsive CSS behavior

---

## How to Run
1. Open the live demo link above or open `index.html` locally.
2. Click on the plank to add a random weight.
3. Click on a weight to remove it.
4. Refresh the page to verify state persistence via LocalStorage.
