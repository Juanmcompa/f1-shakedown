# F1 Shakedown 🏎️

A daily Formula 1 racing challenge. Every day, a new procedurally generated circuit is created. Race against the clock, master the downforce, and claim the pole position.

## 🏁 How to Play
- **Daily Circuit**: A unique track is generated every midnight. Everyone races the same layout.
- **Controls**:
  - `W` / `Up Arrow`: Accelerate
  - `S` / `Down Arrow`: Brake / Reverse
  - `A` / `Left Arrow`: Steer Left
  - `D` / `Right Arrow`: Steer Right
- **Goal**: Complete the lap in the shortest time possible.

## 🛠️ Technical Features
- **Deterministic Generation**: Circuits are generated based on the date seed.
- **F1 Physics**: Implements aerodynamic downforce—the faster you go, the more grip you have in the corners.
- **Decoupled Loop**: Uses a fixed time-step for deterministic physics regardless of frame rate.
- **Three.js Powered**: High-performance 3D rendering in the browser.

## 🚀 Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/f1-shakedown.git
   ```
2. Open the folder in VS Code.
3. Run with **Live Server** (Right click `index.html` $\rightarrow$ Open with Live Server).

---
Developed as a spiritual successor to Shakedown (Rally).
