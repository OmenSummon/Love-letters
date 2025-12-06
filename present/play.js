// Sample data - replace with your actual letters.js file
const letters = [
    { day: 1, color: 'gradient-1', title: "My Dearest", content: "As I write this first letter, my heart is full of love for you. Every moment apart makes me realize just how much you mean to me. Your smile, your laugh, the way you look at me - these are the things I carry with me always.\n\nI miss you more than words can say.\n\nAll my love,\nYours forever" },
    { day: 2, color: 'gradient-2', title: "Hello Beautiful", content: "Just thinking about you makes me smile. Your happiness is contagious, and your joy lights up my entire world. I can't wait to see your beautiful smile again and hold you close.\n\nCounting down the moments until we're together.\n\nLove always" },
    { day: 3, color: 'gradient-3', title: "My Love", content: "You are in every dream, every thought, every moment of my day. Distance can't diminish what we have. If anything, it makes me appreciate you even more.\n\nSweet dreams, knowing you're in mine.\n\nForever yours" },
    { day: 4, color: 'gradient-4', title: "To My Angel", content: "You are the light in my darkness, the calm in my storm. Your presence in my life is a blessing I'm grateful for every single day. Thank you for being you.\n\nYou are loved beyond measure.\n\nYours eternally" },
    { day: 5, color: 'gradient-5', title: "Hey Sunshine", content: "You bring so much happiness into my life. Even when we're apart, the thought of you fills my heart with joy. I can't wait to create more beautiful memories with you.\n\nStay happy, stay amazing.\n\nAll my love" },
    { day: 6, color: 'gradient-6', title: "My Everything", content: "Words cannot express how much you mean to me. You are my today and all of my tomorrows. Every day with you is a blessing.\n\nForever and always.\n\nWith all my heart" },
    { day: 7, color: 'gradient-7', title: "Sweetheart", content: "As another day passes, my love for you only grows stronger. You are the missing piece that completes me. I cherish every moment we share.\n\nUntil we meet again.\n\nYours truly" },
    { day: 8, color: 'gradient-1', title: "My Forever", content: "This journey of letters comes to an end, but our story continues. Thank you for being patient, for being understanding, and for being you. I love you more than you'll ever know.\n\nSee you soon, my love.\n\nForever yours" }
];

const wordPuzzles = {
    1: { word: "HEART", hint: "What beats for you 💓" },
    2: { word: "SMILE", hint: "What you bring to my face ☺️" },
    3: { word: "DREAM", hint: "What I do about you 💭" },
    4: { word: "ANGEL", hint: "What you are to me 👼" },
    5: { word: "HAPPY", hint: "How you make me feel 😊" },
    6: { word: "FOREVER", hint: "How long I'll love you ♾️" },
    7: { word: "SWEET", hint: "What you are 🍭" },
    8: { word: "LOVE", hint: "What I feel for you ❤️" }
};

let START_DATE = new Date('2025-06-28');

let currentDay = 1;
let selectedLetter = null;
let unlockedLetters = {};
let currentGuess = '';
let attempts = 0;
let maxAttempts = 6;
let guesses = [];
let keyboardState = {};
let currentPuzzle = null;

let keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

function calculateCurrentDay() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date('2025-06-28');
    start.setHours(0, 0, 0, 0);
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    currentDay = diffDays + 1;
}

function isUnlocked(day) {
    return day <= currentDay && unlockedLetters[day];
}

function renderEnvelopes() {
    let container = document.getElementById('envelopes');
    container.innerHTML = '';

    letters.forEach(function(letter) {
        let isAvailable = letter.day <= currentDay;
        let isLetterUnlocked = unlockedLetters[letter.day];
        
        let envelope = document.createElement('div');
        envelope.className = 'envelope ' + (isLetterUnlocked ? 'unlocked ' + letter.color : 'locked');
        
        if (isAvailable && !isLetterUnlocked) {
            envelope.onclick = function() {
                startGame(letter);
            };
            envelope.style.cursor = 'pointer';
        } else if (isLetterUnlocked) {
            envelope.onclick = function() {
                openLetter(letter);
            };
        }

        let icon = isLetterUnlocked ? '✉️' : (isAvailable ? '🎮' : '🔒');
        let subtitle = isLetterUnlocked ? 'Click to read' : (isAvailable ? 'Play to unlock' : 'Available on day ' + letter.day);

        envelope.innerHTML = '<div class="envelope-left"><div class="envelope-icon">' + 
            icon + 
            '</div><div><div class="envelope-title">Day ' + letter.day + 
            '</div><div class="envelope-subtitle">' + subtitle + 
            '</div></div></div>' + 
            (isLetterUnlocked ? '<div class="heart-small">❤️</div>' : '');

        container.appendChild(envelope);
    });

    let unlockedCount = Object.keys(unlockedLetters).length;
    document.getElementById('dayCounter').textContent = 'Day ' + currentDay + ' of our journey';
}

function startGame(letter) {
    selectedLetter = letter;
    currentPuzzle = wordPuzzles[letter.day];
    currentGuess = '';
    attempts = 0;
    guesses = [];
    keyboardState = {};
    
    document.getElementById('gameDay').textContent = letter.day;
    document.getElementById('hintSection').textContent = currentPuzzle.hint;
    document.getElementById('gameCard').className = 'game-card ' + letter.color;
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('gameMessage').textContent = '';
    document.getElementById('gameMessage').className = 'message';
    
    renderKeyboard();
    renderGuesses();
    
    document.getElementById('mainView').style.display = 'none';
    document.getElementById('gameView').classList.add('active');
}

function renderKeyboard() {
    let container = document.getElementById('keyboard');
    container.innerHTML = '';
    
    keyboard.forEach(function(row) {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        row.forEach(function(key) {
            let keyBtn = document.createElement('button');
            keyBtn.className = 'key' + (key.length > 1 ? ' wide' : '');
            keyBtn.textContent = key;
            keyBtn.onclick = function() { handleKeyPress(key); };
            
            if (keyboardState[key]) {
                keyBtn.classList.add(keyboardState[key]);
            }
            
            rowDiv.appendChild(keyBtn);
        });
        
        container.appendChild(rowDiv);
    });
}

function renderGuesses() {
    let container = document.getElementById('guessesContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < maxAttempts; i++) {
        let guessDiv = document.createElement('div');
        guessDiv.className = 'word-display';
        
        let wordLength = currentPuzzle.word.length;
        for (let j = 0; j < wordLength; j++) {
            let box = document.createElement('div');
            box.className = 'letter-box';
            
            if (guesses[i]) {
                box.textContent = guesses[i].letters[j];
                box.classList.add(guesses[i].states[j]);
            } else if (i === attempts && currentGuess[j]) {
                box.textContent = currentGuess[j];
            }
            
            guessDiv.appendChild(box);
        }
        
        container.appendChild(guessDiv);
    }
}

function handleKeyPress(key) {
    if (attempts >= maxAttempts) return;
    
    let msg = document.getElementById('gameMessage');
    msg.textContent = '';
    
    if (key === '⌫') {
        currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
        if (currentGuess.length === currentPuzzle.word.length) {
            submitGuess();
        } else {
            msg.textContent = 'Not enough letters!';
            msg.className = 'message error';
        }
    } else if (currentGuess.length < currentPuzzle.word.length) {
        currentGuess += key;
    }
    
    renderGuesses();
}

function submitGuess() {
    let target = currentPuzzle.word;
    let states = [];
    let letterCount = {};
    
    for (let i = 0; i < target.length; i++) {
        letterCount[target[i]] = (letterCount[target[i]] || 0) + 1;
    }
    
    for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === target[i]) {
            states[i] = 'correct';
            letterCount[currentGuess[i]]--;
        } else {
            states[i] = 'absent';
        }
    }
    
    for (let i = 0; i < currentGuess.length; i++) {
        if (states[i] === 'absent' && letterCount[currentGuess[i]] > 0) {
            states[i] = 'present';
            letterCount[currentGuess[i]]--;
        }
    }
    
    guesses.push({
        letters: currentGuess.split(''),
        states: states
    });
    
    for (let i = 0; i < currentGuess.length; i++) {
        let letter = currentGuess[i];
        let state = states[i];
        
        if (!keyboardState[letter] || 
            (state === 'correct') ||
            (state === 'present' && keyboardState[letter] !== 'correct')) {
            keyboardState[letter] = state;
        }
    }
    
    attempts++;
    document.getElementById('attemptCount').textContent = attempts;
    
    let msg = document.getElementById('gameMessage');
    
    if (currentGuess === target) {
        msg.textContent = '🎉 Correct! Letter unlocked!';
        msg.className = 'message success';
        unlockedLetters[selectedLetter.day] = true;
        
        setTimeout(function() {
            closeGame();
            openLetter(selectedLetter);
        }, 1500);
    } else if (attempts >= maxAttempts) {
        msg.textContent = 'The word was: ' + target + '. Try again!';
        msg.className = 'message error';
        
        setTimeout(function() {
            closeGame();
        }, 2500);
    }
    
    currentGuess = '';
    renderKeyboard();
    renderGuesses();
}

function closeGame() {
    document.getElementById('mainView').style.display = 'block';
    document.getElementById('gameView').classList.remove('active');
    renderEnvelopes();
}

function openLetter(letter) {
    document.getElementById('letterTitle').textContent = letter.title;
    document.getElementById('letterDay').textContent = 'Day ' + letter.day + ' of 8';
    document.getElementById('letterText').textContent = letter.content;
    document.getElementById('letterCard').className = 'letter-card ' + letter.color;
    
    document.getElementById('mainView').style.display = 'none';
    document.getElementById('letterView').classList.add('active');
}

function closeLetter() {
    document.getElementById('mainView').style.display = 'block';
    document.getElementById('letterView').classList.remove('active');
}

calculateCurrentDay();
renderEnvelopes();

document.addEventListener('keydown', function(e) {
    if (document.getElementById('gameView').classList.contains('active')) {
        let key = e.key.toUpperCase();
        
        if (key === 'BACKSPACE') {
            handleKeyPress('⌫');
        } else if (key === 'ENTER') {
            handleKeyPress('ENTER');
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
            handleKeyPress(key);
        }
    }
});

window.closeGame = closeGame;
window.openLetter = openLetter;
window.closeLetter = closeLetter;