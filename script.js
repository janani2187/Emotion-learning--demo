// Question data with exact timestamps and correct answers
const questions = [
{ timestamp: 150.00, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 156.60, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 162.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 168.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 176.60, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 180.60, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 186.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 192.60, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 198.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 204.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 210.60, text: "How do you feel?", correctAnswer: "Happy" },
{ timestamp: 216.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 222.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 228.60, text: "How do you feel?", correctAnswer: "Sad" },
{ timestamp: 234.60, text: "How do you feel?", correctAnswer: "Happy" }
];
// DOM Elements
const video = document.getElementById('emotionVideo');
const questionModal = document.getElementById('questionModal');
const questionText = document.getElementById('questionText');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackText = document.getElementById('feedbackText');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const answerButtons = document.querySelectorAll('.answer-button');
// State Variables
let currentQuestionIndex = 0;
let isAnswering = false;
let triggeredQuestions = new Set();
// Initialize
document.addEventListener('DOMContentLoaded', () => {
answerButtons.forEach(button => {
button.addEventListener('click', handleAnswer);
});
video.addEventListener('timeupdate', checkPausePoint);
video.addEventListener('ended', handleVideoEnd);

updateProgress(0);
});
// Check timestamps
function checkPausePoint() {
if (currentQuestionIndex >= questions.length) return;
const question = questions[currentQuestionIndex];
const currentTime = video.currentTime;

if (
    currentTime >= question.timestamp &&
    !triggeredQuestions.has(currentQuestionIndex)
) {
    triggeredQuestions.add(currentQuestionIndex);

    video.pause();
    showQuestion(currentQuestionIndex);
    isAnswering = true;
}
}
// Show question popup
function showQuestion(index) {
const question = questions[index];
questionText.textContent = question.text;

questionModal.classList.remove('hidden');
feedbackMessage.classList.add('hidden');

answerButtons.forEach(button => {
    button.disabled = false;
});

updateProgress(index + 1);
}
// Handle answer
function handleAnswer(event) {
if (!isAnswering) return;
const selectedAnswer = event.currentTarget.dataset.answer;
const correctAnswer = questions[currentQuestionIndex].correctAnswer;

answerButtons.forEach(button => {
    button.disabled = true;
});

questionModal.classList.add('hidden');
feedbackMessage.classList.remove('hidden');

if (selectedAnswer === correctAnswer) {
    feedbackText.textContent = "⭐ Great Job!";
} else {
    feedbackText.textContent = "⭐ Let's Try Again!";
}

isAnswering = false;

setTimeout(() => {
    continueToNextQuestion();
}, 2000);
}
// Continue after feedback
function continueToNextQuestion() {
feedbackMessage.classList.add('hidden');
currentQuestionIndex++;

video.play();
}
// Progress indicator
function updateProgress(questionNumber) {
progressText.textContent =
Question ${questionNumber} of ${questions.length};
const percentage =
    (questionNumber / questions.length) * 100;

progressFill.style.width = percentage + "%";
}
// Video finished
function handleVideoEnd() {
questionModal.classList.add('hidden');
feedbackMessage.classList.add('hidden');
progressText.textContent = "Completed!";
progressFill.style.width = "100%";
}
// Keyboard Accessibility
document.addEventListener('keydown', (event) => {
if (!isAnswering) return;
if (event.key === 'Enter') {
    const focused = document.activeElement;

    if (
        focused &&
        focused.classList.contains('answer-button')
    ) {
        focused.click();
    }
}
});
