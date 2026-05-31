// Question data with timestamps and correct answers
const questions = [
    {
        timestamp: 126.00, // 02:06.00
        text: "How do you feel when your mother hugs you?",
        correctAnswer: "Happy"
    },
    {
        timestamp: 133.28, // 02:13.28
        text: "How do you feel when your father takes you out to the park?",
        correctAnswer: "Happy"
    },
    {
        timestamp: 141.13, // 02:21.13
        text: "How do you feel when your parents scold you?",
        correctAnswer: "Sad"
    },
    {
        timestamp: 169.45, // 02:49.45 (corrected from 02:29.45 which would be 149.45)
        text: "How do you feel when you fall and get hurt?",
        correctAnswer: "Sad"
    }
];

// DOM Elements
const video = document.getElementById('emotionVideo');
const questionSection = document.getElementById('questionSection');
const feedbackSection = document.getElementById('feedbackSection');
const completionSection = document.getElementById('completionSection');
const startSection = document.getElementById('startSection');
const questionText = document.getElementById('questionText');
const feedbackMessage = document.getElementById('feedbackMessage');
const continueButton = document.getElementById('continueButton');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const answerButtons = document.querySelectorAll('.answer-button');

// State variables
let currentQuestionIndex = 0;
let questionsAnswered = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    startButton.addEventListener('click', startLearning);
    continueButton.addEventListener('click', continueToNextQuestion);
    restartButton.addEventListener('click', restartLearning);
    
    // Add event listeners to answer buttons
    answerButtons.forEach(button => {
        button.addEventListener('click', handleAnswer);
    });

    // Add timeupdate listener to check for pause points
    video.addEventListener('timeupdate', checkPausePoint);
    
    // Handle video end
    video.addEventListener('ended', showCompletion);
});

function startLearning() {
    startSection.classList.add('hidden');
    questionSection.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    questionsAnswered = 0;
    
    video.play();
}

function checkPausePoint() {
    // Check if we've reached a question timestamp
    for (let i = currentQuestionIndex; i < questions.length; i++) {
        const question = questions[i];
        // Pause when we're within 0.5 seconds of the timestamp
        if (Math.abs(video.currentTime - question.timestamp) < 0.5 && video.currentTime >= question.timestamp - 0.5) {
            video.pause();
            showQuestion(i);
            currentQuestionIndex = i;
            break;
        }
    }
}

function showQuestion(index) {
    const question = questions[index];
    questionText.textContent = question.text;
    
    questionSection.classList.remove('hidden');
    feedbackSection.classList.add('hidden');
    
    // Enable all answer buttons
    answerButtons.forEach(button => {
        button.disabled = false;
    });
}

function handleAnswer(event) {
    const selectedAnswer = event.currentTarget.dataset.answer;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    
    // Disable all buttons
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Show feedback
    questionSection.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    
    if (selectedAnswer === correctAnswer) {
        feedbackMessage.textContent = '⭐ Great Job!';
        questionsAnswered++;
    } else {
        feedbackMessage.textContent = '⭐ Let\'s try again.';
    }
}

function continueToNextQuestion() {
    currentQuestionIndex++;
    
    feedbackSection.classList.add('hidden');
    
    if (currentQuestionIndex < questions.length) {
        questionSection.classList.remove('hidden');
        video.play();
    } else {
        showCompletion();
    }
}

function showCompletion() {
    questionSection.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    completionSection.classList.remove('hidden');
    video.pause();
}

function restartLearning() {
    completionSection.classList.add('hidden');
    startSection.classList.remove('hidden');
    
    // Reset video
    video.currentTime = 0;
    currentQuestionIndex = 0;
    questionsAnswered = 0;
    
    // Reset buttons
    answerButtons.forEach(button => {
        button.disabled = false;
    });
}

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        if (!startSection.classList.contains('hidden') && event.target === startButton) {
            startLearning();
        } else if (!feedbackSection.classList.contains('hidden') && event.target === continueButton) {
            continueToNextQuestion();
        } else if (!completionSection.classList.contains('hidden') && event.target === restartButton) {
            restartLearning();
        }
    }
});
