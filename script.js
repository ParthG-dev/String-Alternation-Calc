// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Character counter
const inputString = document.getElementById('inputString');
const charCounter = document.getElementById('charCounter');

inputString.addEventListener('input', () => {
    const length = inputString.value.length;
    charCounter.textContent = `${length}/30`;
});

// Original algorithm
function minMovesToAlternate(s) {
    const n = s.length;
    let pattern1Matches = 0;
    let pattern2Matches = 0;

    for (let i = 0; i < n; i++) {
        // Pattern 1: 'B' at even positions, 'G' at odd positions (0-based)
        if (i % 2 === 0 && s[i] === 'B') pattern1Matches++;
        if (i % 2 === 1 && s[i] === 'G') pattern1Matches++;

        // Pattern 2: 'G' at even positions, 'B' at odd positions
        if (i % 2 === 0 && s[i] === 'G') pattern2Matches++;
        if (i % 2 === 1 && s[i] === 'B') pattern2Matches++;
    }

    const maxMatches = Math.max(pattern1Matches, pattern2Matches);
    return {
        moves: n - maxMatches,
        pattern: pattern1Matches > pattern2Matches ? 'BGBGBG...' : 'GBGBGB...',
        matches: {
            pattern1: pattern1Matches,
            pattern2: pattern2Matches
        }
    };
}

function validateInput(s) {
    return /^[BG]+$/.test(s);
}

function visualizeString(s, targetId) {
    const visualization = document.getElementById(targetId);
    visualization.innerHTML = '';
    
    [...s].forEach((char, index) => {
        const box = document.createElement('div');
        box.className = `char-box char-${char}`;
        box.textContent = char;
        box.style.animationDelay = `${index * 0.1}s`;
        visualization.appendChild(box);
    });
}

function generateOptimalPattern(s, pattern) {
    const n = s.length;
    const optimal = [];
    const firstChar = pattern[0];
    
    for (let i = 0; i < n; i++) {
        optimal.push(i % 2 === 0 ? firstChar : (firstChar === 'B' ? 'G' : 'B'));
    }
    
    return optimal.join('');
}

function generateExplanation(s, result) {
    const explanation = document.getElementById('explanation');
    const { moves, pattern, matches } = result;
    
    explanation.innerHTML = `
        <p>1. We check two possible patterns:</p>
        <ul>
            <li>Pattern 1 (BGBGBG...): ${matches.pattern1} characters match</li>
            <li>Pattern 2 (GBGBGB...): ${matches.pattern2} characters match</li>
        </ul>
        <p>2. The optimal pattern is: ${pattern}</p>
        <p>3. Total characters: ${s.length}</p>
        <p>4. Maximum matching characters: ${Math.max(matches.pattern1, matches.pattern2)}</p>
        <p>5. Minimum moves needed: ${moves} (${s.length} - ${Math.max(matches.pattern1, matches.pattern2)})</p>
    `;
}

function calculateMoves() {
    const input = inputString.value.toUpperCase();
    const resultDiv = document.getElementById('result');
    const copyBtn = document.querySelector('.copy-btn');
    
    if (!input) {
        resultDiv.querySelector('span').textContent = 'Please enter a string';
        copyBtn.style.display = 'none';
        document.getElementById('visualization').innerHTML = '';
        document.getElementById('optimalPattern').innerHTML = '';
        document.getElementById('explanation').innerHTML = '';
        return;
    }

    if (!validateInput(input)) {
        resultDiv.querySelector('span').textContent = 'Invalid input! Please use only B and G characters.';
        copyBtn.style.display = 'none';
        document.getElementById('visualization').innerHTML = '';
        document.getElementById('optimalPattern').innerHTML = '';
        document.getElementById('explanation').innerHTML = '';
        return;
    }

    const result = minMovesToAlternate(input);
    resultDiv.querySelector('span').textContent = `Minimum moves needed: ${result.moves}`;
    copyBtn.style.display = 'block';
    
    visualizeString(input, 'visualization');
    
    const optimalPattern = generateOptimalPattern(input, result.pattern);
    visualizeString(optimalPattern, 'optimalPattern');
    
    generateExplanation(input, result);
}

function copyResult() {
    const resultText = document.querySelector('.result-content span').textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    });
}

function setExample(example) {
    inputString.value = example;
    charCounter.textContent = `${example.length}/30`;
    calculateMoves();
}

// Add input validation on keyup
inputString.addEventListener('keyup', function(e) {
    this.value = this.value.toUpperCase();
    if (e.key === 'Enter') {
        calculateMoves();
    }
}); 