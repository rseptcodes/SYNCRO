# ⏱️ SYNCRO: Advanced Multi-Timer & Stopwatch Manager

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## 💡 The Story Behind the Project
I needed a reliable way to manage multiple timing tasks simultaneously—whether it was tracking a quick countdown or an open-ended stopwatch. Instead of relying on heavy frameworks like React to handle the interface updates, I challenged myself to build **SYNCRO**: a multi-timer application using strictly Vanilla JavaScript. The core goal was to master complex state management, implement a custom Observer pattern, and deeply understand the browser's render cycle to create an incredibly smooth and accurate user experience.

## ✨ Features

* **Multi-Tracking Engine:** Create and run multiple countdown timers and stopwatches concurrently without performance drops.
* **Precise Global Clock:** Powered by a custom `masterTick` engine utilizing `performance.now()` and `requestAnimationFrame`, ensuring high accuracy and battery-friendly performance compared to traditional `setInterval` approaches.
* **Dynamic Visual Feedback:** Clean UI with progress bars that sync perfectly with the timer's state, pausing when you pause, and displaying a distinct "Finished" state the exact moment a countdown hits `00:00`.
* **Smart State Control:** Pause, resume, and delete timers on the fly. The app handles the exact order of execution flawlessly so you never lose a millisecond visually.
* **Flawless UI Transitions:** Built-in safeguards (`isTransitioning`) prevent animation overlapping. Smooth fade-ins, collapses, and modal overlays keep the interaction feeling premium.
* **🌗 Dark & Light Themes:** Fully integrated theme manager that instantly adapts the UI to your preference.

## 🛠️ Technologies Used

* **Vanilla JavaScript (ES6+):** Architected using object namespaces to separate logic from UI. Implemented a custom **Observer pattern** (`appState.subscribe/update`) for reactive state management, DOM caching for performance, and complex asynchronous event handling.
* **CSS3:** Advanced usage of CSS Custom Properties (Variables) to control dynamic progress bar durations, state-based modifier classes (`--paused`, `--finished`), and seamless keyframe animations (`fadeIn`, `fadeOut`, `fade-out-collapse`).
* **HTML5:** Fully dynamic semantic DOM generation and structure injected directly via JavaScript logic.

---

## 🚀 Future Improvements

* **ES6 Modules Refactoring:** Currently, the project is structured in a single-entry point for simplicity during the initial build. The next milestone is to decouple the code into distinct ES6 modules (`state.js`, `ui.js`, `timer.js`, etc.) to improve maintainability, scalability, and align with modern enterprise standards.
