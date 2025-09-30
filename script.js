// Initialize Lucide Icons
lucide.createIcons();

// Global State
const state = {
    currentPage: 'home-section',
    quiz: {
        currentQuestionIndex: 0,
        score: 0,
        isFinished: false,
    },
    badges: {
        knowledge: false,
        quizmaster: false,
        champion: false,
    }
};

const quizQuestions = [
    {
        q: "What is the primary purpose of a DBT-enabled bank account?",
        options: ["To pay utility bills.", "To receive government benefits directly.", "To withdraw cash from any ATM.", "To save money for retirement."],
        answer: "To receive government benefits directly.",
        level: 1
    },
    {
        q: "If your bank account is only 'Aadhaar Linked', can you receive a scholarship directly into it via DBT?",
        options: ["Yes, linking is enough.", "No, it must also be DBT-Enabled.", "Only if the bank approves it.", "Only if the scholarship is small."],
        answer: "No, it must also be DBT-Enabled.",
        level: 1
    },
    {
        q: "What is the NPCI Mapper primarily used for in the context of DBT?",
        options: ["Tracking your loan history.", "Transferring funds between private banks.", "Routing government benefits to the latest DBT-enabled account.", "Checking your credit score."],
        answer: "Routing government benefits to the latest DBT-enabled account.",
        level: 2
    }
];

// --- Core Navigation Logic ---
function navigate(targetId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        state.currentPage = targetId;
    }

    document.querySelectorAll('.icon-nav').forEach(nav => {
        nav.classList.remove('active');
    });
    document.querySelector(`[onclick="navigate('${targetId}')"]`).classList.add('active');

    document.querySelector('main').scrollTop = 0;
    
    if (targetId === 'awareness-section' && !state.badges.knowledge) {
        setTimeout(() => {
            awardBadge('knowledge');
        }, 1000);
    }
}

// --- Account Verification Logic ---
const verificationForm = document.getElementById('verification-form');
const aadhaarInput = document.getElementById('aadhaar-input');
const aadhaarError = document.getElementById('aadhaar-error');
const verificationResult = document.getElementById('verification-result');

verificationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const aadhaarNumber = aadhaarInput.value.trim();
    aadhaarError.classList.add('hidden');
    
    if (aadhaarNumber.length !== 12) {
        aadhaarError.classList.remove('hidden');
        return;
    }
    
    verificationResult.classList.remove('hidden');
    verificationResult.className = 'mt-6 p-4 rounded-xl text-center';
    verificationResult.innerHTML = '<i data-lucide="loader-circle" class="w-6 h-6 mx-auto animate-spin text-[var(--color-primary)]"></i><p class="mt-2 text-gray-500">Processing verification...</p>';
    lucide.createIcons();

    setTimeout(() => {
        const lastDigit = parseInt(aadhaarNumber.slice(-1));
        let resultMessage = '';
        let resultClass = '';
        let resultIcon = '';

        if (lastDigit >= 0 && lastDigit <= 3) {
            resultIcon = 'check-circle';
            resultClass = 'bg-green-100 border-green-500 text-green-700';
            resultMessage = `
                <i data-lucide="${resultIcon}" class="w-10 h-10 mx-auto mb-3 text-green-600"></i>
                <h4 class="text-xl font-bold">🎉 Congratulations!</h4>
                <p class="mt-2 font-semibold">Your account is linked and <span class="text-green-600">DBT-enabled</span>.</p>
                <p class="text-sm mt-1">You are ready to receive government benefits directly into this account.</p>
            `;
            awardBadge('champion');
        } else if (lastDigit >= 4 && lastDigit <= 6) {
            resultIcon = 'alert-triangle';
            resultClass = 'bg-yellow-100 border-yellow-500 text-yellow-700';
            resultMessage = `
                <i data-lucide="${resultIcon}" class="w-10 h-10 mx-auto mb-3 text-yellow-600"></i>
                <h4 class="text-xl font-bold">⚠️ Action Required</h4>
                <p class="mt-2 font-semibold">Your account is linked, but <span class="text-red-500">NOT DBT-enabled</span>.</p>
                <p class="text-sm mt-1">You must **seed your account with NPCI Mapper**. Please visit your bank branch or use their online portal to complete this process.</p>
            `;
        } else {
            resultIcon = 'x-octagon';
            resultClass = 'bg-red-100 border-red-500 text-red-700';
            resultMessage = `
                <i data-lucide="${resultIcon}" class="w-10 h-10 mx-auto mb-3 text-red-600"></i>
                <h4 class="text-xl font-bold">❌ Linking Required</h4>
                <p class="mt-2 font-semibold">Your Aadhaar is <span class="text-red-500">NOT linked</span> to this bank account.</p>
                <p class="text-sm mt-1">You must link it and ensure it's DBT-enabled to receive direct benefits.</p>
            `;
        }

        verificationResult.className = `mt-6 p-4 rounded-xl text-center border-l-4 ${resultClass}`;
        verificationResult.innerHTML = resultMessage;
        lucide.createIcons();
    }, 1500);
});

// --- New Chatbot Toggle Logic ---
function toggleChatbot(show) {
    const openIcon = document.getElementById('chatbot-open-icon');
    const fullInterface = document.getElementById('full-chatbot-interface');
    
    if (show) {
        openIcon.classList.add('hidden');
        fullInterface.classList.remove('hidden');
        const history = document.getElementById('chatbot-history');
        history.scrollTop = history.scrollHeight;
    } else {
        fullInterface.classList.add('hidden');
        openIcon.classList.remove('hidden');
    }
    lucide.createIcons();
}

// --- Chatbot Logic (Aadhaar-Buddy) ---
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotHistory = document.getElementById('chatbot-history');

chatbotSendBtn.addEventListener('click', handleChatbotInput);
chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleChatbotInput();
    }
});

function handleChatbotInput() {
    const userText = chatbotInput.value.trim();
    if (userText === '') return;

    addMessage(userText, 'user');
    chatbotInput.value = '';

    let botResponse = '';
    const query = userText.toLowerCase();

    if (query.includes('what is dbt')) {
        botResponse = "DBT stands for **Direct Benefit Transfer**. It's a method where subsidies and benefits from the government are sent directly to the beneficiary's bank account, ensuring transparency and reducing fraud.";
    } else if (query.includes('how do i check my status')) {
        botResponse = "To check your status, you generally need to visit the official NPCI website or your bank's portal. In this prototype, you can use the **Account Verification** section (the 'Check' tab) for a simulated check!";
    } else if (query.includes('aadhaar linked') && query.includes('dbt enabled')) {
        botResponse = "Good question! **Aadhaar Linked** simply connects your Aadhaar number to your bank record. **DBT-Enabled** means your account is mapped with NPCI to receive transfers. You need the latter for benefits!";
    } else {
        botResponse = "That's an interesting question! I'm programmed to answer common questions about DBT and Aadhaar linking. Try asking about **'What is DBT?'** or **'How do I check my status?'**";
    }

    setTimeout(() => {
        addMessage(botResponse, 'ai');
    }, 800);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message-${sender} p-3 rounded-xl card-shadow`;
    messageDiv.innerHTML = text;
    chatbotHistory.appendChild(messageDiv);
    chatbotHistory.scrollTop = chatbotHistory.scrollHeight;
}

// --- Quiz and Gamification Logic ---
const quizArea = document.getElementById('quiz-area');
const quizStartBtn = document.getElementById('quiz-start-btn');
const quizResult = document.getElementById('quiz-result');

quizStartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    state.quiz.currentQuestionIndex = 0;
    state.quiz.score = 0;
    state.quiz.isFinished = false;
    quizStartBtn.textContent = 'Next Question';
    quizStartBtn.classList.remove('bg-green-500', 'bg-blue-600', 'bg-red-500');
    quizStartBtn.classList.add('bg-blue-600');
    quizResult.textContent = '';
    loadQuestion();
}

function loadQuestion() {
    if (state.quiz.currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    const qData = quizQuestions[state.quiz.currentQuestionIndex];
    
    const shuffledOptions = shuffleArray([...qData.options]);

    let optionsHtml = shuffledOptions.map(option => `
        <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input type="radio" name="quiz-option" value="${option}" class="text-[var(--color-primary)] focus:ring-[var(--color-primary)]">
            <span class="ml-3 text-gray-700 font-medium">${option}</span>
        </label>
    `).join('');

    quizArea.innerHTML = `
        <div class="p-4 bg-[var(--color-primary)] text-white rounded-lg">
            <p class="font-bold text-lg">Question ${state.quiz.currentQuestionIndex + 1}:</p>
            <p class="mt-1">${qData.q}</p>
        </div>
        <div class="space-y-2 mt-4">
            ${optionsHtml}
        </div>
    `;
    quizStartBtn.textContent = 'Submit Answer';
    quizStartBtn.onclick = submitAnswer;
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
    if (!selectedOption) {
        showCustomAlert('Wait!', 'Please select an answer before submitting.');
        return;
    }

    const userAnswer = selectedOption.value;
    const correctAnswer = quizQuestions[state.quiz.currentQuestionIndex].answer;
    
    document.querySelectorAll('input[name="quiz-option"]').forEach(input => {
        const label = input.closest('label');
        label.style.pointerEvents = 'none';

        if (input.value === correctAnswer) {
            label.classList.add('bg-green-200', 'border-2', 'border-green-500');
        } else if (input.checked) {
            label.classList.add('bg-red-200', 'border-2', 'border-red-500');
        }
    });

    if (userAnswer === correctAnswer) {
        state.quiz.score++;
        quizResult.textContent = 'Correct! 👍';
        quizResult.classList.remove('text-red-500');
        quizResult.classList.add('text-green-600');
    } else {
        quizResult.textContent = `Incorrect. The correct answer was: "${correctAnswer}"`;
        quizResult.classList.remove('text-green-600');
        quizResult.classList.add('text-red-500');
    }
    
    quizStartBtn.textContent = 'Next Question';
    quizStartBtn.onclick = () => {
        state.quiz.currentQuestionIndex++;
        quizResult.textContent = '';
        loadQuestion();
    };
}

function endQuiz() {
    state.quiz.isFinished = true;
    const totalQuestions = quizQuestions.length;
    const finalScore = state.quiz.score;
    
    let message = `<p class="text-lg font-bold">Quiz Finished!</p>`;
    
    if (finalScore === totalQuestions) {
        message += `<p class="text-green-600 text-2xl font-extrabold mt-2">Perfect Score! (${finalScore}/${totalQuestions})</p>`;
        awardBadge('quizmaster');
    } else if (finalScore >= totalQuestions * 0.5) {
        message += `<p class="text-amber-600 text-2xl font-extrabold mt-2">Great Job! (${finalScore}/${totalQuestions})</p>`;
    } else {
        message += `<p class="text-red-500 text-2xl font-extrabold mt-2">Keep Learning! (${finalScore}/${totalQuestions})</p>`;
    }
    
    message += `<p class="text-sm mt-3">Watch the videos again or chat with Aadhaar-Buddy to improve!</p>`;

    quizArea.innerHTML = `<div class="p-6 bg-white rounded-lg text-center card-shadow">${message}</div>`;
    quizStartBtn.textContent = 'Restart Quiz';
    quizStartBtn.onclick = startQuiz;
}

// --- Badge System ---
function awardBadge(badgeKey) {
    if (state.badges[badgeKey]) return;

    state.badges[badgeKey] = true;
    let title, message, badgeElement;

    if (badgeKey === 'knowledge') {
        title = 'Knowledge Seeker Awarded!';
        message = 'You completed the Awareness Content section. You are on your way to becoming a DBT expert!';
        badgeElement = document.getElementById('badge-knowledge');
        badgeElement.classList.replace('bg-gray-100', 'bg-indigo-500');
        badgeElement.classList.replace('border-dashed', 'border-solid');
        badgeElement.classList.add('border-indigo-700');
        badgeElement.querySelector('i').classList.replace('text-gray-500', 'text-white');
        badgeElement.querySelector('p').classList.replace('text-gray-600', 'text-white');
    } else if (badgeKey === 'quizmaster') {
        title = 'Quiz Master Awarded!';
        message = 'Perfect score on the quiz! Your understanding of DBT fundamentals is excellent.';
        badgeElement = document.getElementById('badge-quizmaster');
        badgeElement.classList.replace('bg-gray-100', 'bg-amber-500');
        badgeElement.classList.replace('border-dashed', 'border-solid');
        badgeElement.classList.add('border-amber-700');
        badgeElement.querySelector('i').classList.replace('text-gray-500', 'text-white');
        badgeElement.querySelector('p').classList.replace('text-gray-600', 'text-white');
    } else if (badgeKey === 'champion') {
        title = 'DBT Champion Awarded!';
        message = 'You successfully verified your simulated account status as linked and DBT-enabled!';
        badgeElement = document.getElementById('badge-champion');
        badgeElement.classList.replace('bg-gray-100', 'bg-green-500');
        badgeElement.classList.replace('border-dashed', 'border-solid');
        badgeElement.classList.add('border-green-700');
        badgeElement.querySelector('i').classList.replace('text-gray-500', 'text-white');
        badgeElement.querySelector('p').classList.replace('text-gray-600', 'text-white');
    }

    if (badgeElement) {
        badgeElement.classList.add('animate-bounce');
        setTimeout(() => badgeElement.classList.remove('animate-bounce'), 2000);
    }

    showCustomAlert(title, message, 'success');
}

// --- Utility Functions ---
function showCustomAlert(title, message, type = 'info') {
    const modal = document.getElementById('custom-alert-modal');
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;
    
    const titleElement = document.getElementById('alert-title');
    titleElement.classList.remove('text-green-700', 'text-blue-700');
    if (type === 'success') {
        titleElement.classList.add('text-green-700');
    } else {
        titleElement.classList.add('text-blue-700');
    }
    
    modal.classList.remove('hidden');
}

// Fisher-Yates (Knuth) Shuffle for options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initial load: Ensure Home is shown
window.onload = () => {
    navigate('home-section');
};