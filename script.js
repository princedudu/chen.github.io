// Trivia data (unchanged)
const travelTrivia = [{'question': 'Which city is home to the Eiffel Tower?',
  'options': ['A) London', 'B) Paris', 'C) Berlin', 'D) Rome'],
  'correctAnswer': 'B'},
 {'question': 'Which city is known for its Hollywood film industry?',
  'options': ['A) New York', 'B) Los Angeles', 'C) Miami', 'D) Chicago'],
  'correctAnswer': 'B'},
 {'question': 'What country is known for its paella dish?',
  'options': ['A) Italy', 'B) Spain', 'C) Portugal', 'D) France'],
  'correctAnswer': 'B'},
 {'question': 'What is the capital of Iceland?',
  'options': ['A) Reykjavik', 'B) Akureyri', 'C) Keflavik', 'D) Selfoss'],
  'correctAnswer': 'A'},
 {'question': 'What is the capital of South Africa?',
  'options': ['A) Johannesburg', 'B) Cape Town', 'C) Pretoria', 'D) Durban'],
  'correctAnswer': 'C'},
 {'question': 'What is the capital of South Korea?',
  'options': ['A) Busan', 'B) Seoul', 'C) Incheon', 'D) Daegu'],
  'correctAnswer': 'B'},
 {'question': 'What is the capital of Thailand?',
  'options': ['A) Chiang Mai', 'B) Bangkok', 'C) Phuket', 'D) Pattaya'],
  'correctAnswer': 'B'},
 {'question': 'What country is known for its ancient ruins of Angkor Wat?',
  'options': ['A) Thailand', 'B) Cambodia', 'C) Vietnam', 'D) Laos'],
  'correctAnswer': 'B'},
 {'question': 'Which country is home to Machu Picchu?',
  'options': ['A) Bolivia', 'B) Peru', 'C) Chile', 'D) Ecuador'],
  'correctAnswer': 'B'},
 {'question': 'What is the deepest lake in the world?',
  'options': ['A) Lake Superior',
   'B) Lake Baikal',
   'C) Lake Tanganyika',
   'D) Lake Michigan'],
  'correctAnswer': 'B'},
 {'question': 'What is the capital of Spain?',
  'options': ['A) Barcelona', 'B) Madrid', 'C) Seville', 'D) Valencia'],
  'correctAnswer': 'B'},
 {'question': 'Which city is famous for its Opera House?',
  'options': ['A) Sydney', 'B) Paris', 'C) Vienna', 'D) New York'],
  'correctAnswer': 'A'},
 {'question': 'What is the largest island in the world?',
  'options': ['A) Australia', 'B) Greenland', 'C) Madagascar', 'D) Borneo'],
  'correctAnswer': 'B'},
 {'question': 'Which U.S. city is famous for jazz music?',
  'options': ['A) Miami', 'B) New Orleans', 'C) Chicago', 'D) Los Angeles'],
  'correctAnswer': 'B'},
 {'question': 'What is the highest mountain in South America?',
  'options': ['A) Aconcagua',
   'B) Huascarán',
   'C) Chimborazo',
   'D) Ojos del Salado'],
  'correctAnswer': 'A'}];

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
