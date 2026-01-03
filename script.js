// ================================
// CONFIG
// ================================
const API_URL = "https://calculator-one-peach-61.vercel.app/solve";

// ================================
// ELEMENTS
// ================================
const modeButtons = document.querySelectorAll(".mode-btn");
const solveBtn = document.getElementById("solve-btn");
const problemInput = document.getElementById("problem-input");
const errorMsg = document.getElementById("error-msg");

const outputCard = document.getElementById("output-card");
const outputProblem = document.getElementById("output-problem");
const outputSteps = document.getElementById("output-steps");
const outputAnswer = document.getElementById("output-answer");

// ================================
// STATE
// ================================
let selectedMode = "derivative";

// ================================
// MODE BUTTONS
// ================================
modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedMode = btn.dataset.mode;
    });
});

// ================================
// SOLVE BUTTON
// ================================
solveBtn.addEventListener("click", async () => {
    errorMsg.textContent = "";
    outputCard.hidden = true;

    const problem = problemInput.value.trim();

    if (!problem) {
        errorMsg.textContent = "Please enter a problem.";
        return;
    }

    let limitPoint = null;

    if (selectedMode === "limit") {
        limitPoint = prompt("Enter the limit point (example: 0)");
        if (limitPoint === null || limitPoint.trim() === "") {
            errorMsg.textContent = "Limit point is required.";
            return;
        }
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: selectedMode,
                problem: problem,
                limitPoint: limitPoint
            })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        // Fill output
        outputProblem.textContent = data.problem || problem;

        outputSteps.innerHTML = "";
        if (Array.isArray(data.steps)) {
            data.steps.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step;
                outputSteps.appendChild(li);
            });
        }

        outputAnswer.textContent = data.answer || "No answer";

        outputCard.hidden = false;

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Could not connect to backend.";
    }
});
