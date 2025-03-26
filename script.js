// Trivia data (unchanged)
const travelTrivia = [
    { question: "What is the capital city of Brazil? c", options: ["A) Rio de Janeiro", "B) São Paulo", "C) Brasília", "D) Salvador"], correctAnswer: "C" },
    { question: "Which country has the most deserts?", options: ["A) Australia", "B) Antarctica", "C) Egypt", "D) Chile"], correctAnswer: "B" },
    { question: "What is the tallest mountain in the world?", options: ["A) K2", "B) Kangchenjunga", "C) Everest", "D) Lhotse"], correctAnswer: "C" },
    { question: "Which city is known as the 'City of Love'?", options: ["A) Venice", "B) Paris", "C) Rome", "D) Florence"], correctAnswer: "B" },
    { question: "What is the longest river in the world?", options: ["A) Nile", "B) Amazon", "C) Yangtze", "D) Mississippi"], correctAnswer: "A" }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function loadQuestion() {
    const container = document.getElementById("question-container");
    const q = travelTrivia[currentQuestionIndex];
    container.innerHTML = `
        <div class="question">
            <h3>${currentQuestionIndex + 1}. ${q.question}</h3>
            <div class="options">
                ${q.options.map(option => `
                    <label>
                        <input type="radio" name="answer" value="${option.charAt(0)}">
                        ${option}
                    </label>
                `).join("")}
            </div>
        </div>
    `;
}

function checkAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert("Please select an answer!");
        return;
    }

    const userAnswer = selected.value;
    const currentQuestion = travelTrivia[currentQuestionIndex];
    userAnswers.push({ question: currentQuestion.question, answer: userAnswer });

    if (userAnswer === currentQuestion.correctAnswer) {
        score++;
        currentQuestionIndex++;
        if (currentQuestionIndex < travelTrivia.length) {
            loadQuestion();
        } else {
            endGame(true);
        }
    } else {
        endGame(false);
    }
}

async function endGame(completedAll) {
    const totalQuestions = travelTrivia.length;
    const resultsDiv = document.getElementById("results");
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.style.display = "none";

    if (completedAll) {
        resultsDiv.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You answered all ${totalQuestions} questions correctly!</p>
            <p>Your score: ${score}/${totalQuestions} (100%)</p>
            <p>You're a true travel expert!</p>
        `;
    } else {
        const percentage = (score / totalQuestions) * 100;
        resultsDiv.innerHTML = `
            <h2>Game Over</h2>
            <p>You got a wrong answer!</p>
            <p>Your score: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)</p>
            ${score > 0 ? "<p>Not bad! Keep exploring!</p>" : "<p>Better luck next time!</p>"}
        `;
    }

    // Prepare data to send
    const responseData = { timestamp: new Date().toISOString(), answers: userAnswers, score };

    // Send to server
    try {
        const response = await fetch('https://trivia-backend-esmo.onrender.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData)
        });
        if (response.ok) {
            console.log("Data successfully sent to server!");
        } else {
            console.error("Failed to send data:", response.status);
        }
    } catch (error) {
        console.error("Error sending data:", error);
    }

    // Still store locally as a fallback
    const storedAnswers = JSON.parse(localStorage.getItem("triviaAnswers") || "[]");
    storedAnswers.push(responseData);
    localStorage.setItem("triviaAnswers", JSON.stringify(storedAnswers));
    console.log("All stored answers (local):", storedAnswers);
}

window.onload = function () {
    loadQuestion();
};
