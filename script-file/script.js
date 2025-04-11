// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Handle PWA installation prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA installation available');
});

// nav links dot active js

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-links li a");

    function setActiveLink() {
        let currentURL = window.location.href;

        navLinks.forEach(link => {
            if (link.href === currentURL) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        });
    }

    setActiveLink(); // Call function on page load

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            setTimeout(setActiveLink, 100); // Ensure it works on page navigation
        });
    });
});


// calculator js 

const calchisIcon = document.getElementById('calchis');
const hisTable = document.getElementById('his-table');
const historyPlaceholder = document.querySelector('.history-placeholder');
let calculationHistory = [];

// Load history from localStorage on page load
function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Call on page load
loadHistoryFromStorage();

function toggleHistoryTable() {
    hisTable.classList.toggle('show');
}

function deleteHistoryEntry(index) {
    calculationHistory.splice(index, 1);
    updateHistoryDisplay();
    // Save to localStorage
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

function updateHistoryDisplay() {
    while (hisTable.firstChild) {
        hisTable.removeChild(hisTable.firstChild);
    }

    if (calculationHistory.length === 0) {
        historyPlaceholder.style.display = 'flex';
        hisTable.appendChild(historyPlaceholder);
        hisTable.style.height = '4rem';
        hisTable.style.maxHeight = '4rem';
        hisTable.style.paddingTop = '0';
        hisTable.style.overflowY = 'hidden';
    } else {
        historyPlaceholder.style.display = 'none';
        calculationHistory.forEach((entry, index) => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            historyEntry.innerHTML = `
        <span class="calculation">${entry.calculation} = ${entry.result}</span>
        <i class="fas fa-trash delete-entry"></i>`;

            historyEntry.querySelector('.calculation').addEventListener('click', () => {
                currentInput = entry.result.toString();
                updateDisplay(currentInput);
            });

            historyEntry.querySelector('.delete-entry').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryEntry(index);
            });

            hisTable.appendChild(historyEntry);
        });

        hisTable.style.height = 'auto';
        hisTable.style.maxHeight = '200px';
        hisTable.style.paddingTop = '1.1rem';
        hisTable.style.overflowY = 'auto';
    }
}

function addToHistory(calculation, result) {
    calculationHistory.unshift({ calculation, result });
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }
    updateHistoryDisplay();
    // Save to localStorage
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

calchisIcon.addEventListener('click', toggleHistoryTable);
document.addEventListener('keydown', function (event) {
    if (event.key === 'h' || event.key === 'H') {
        toggleHistoryTable();
    }
});

// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';

function updateDisplay(value) {
    display.value = value;
}

function handleClick(event) {
    const button = event.target.closest('.btn');
    if (!button) return;

    const buttonValue = button.getAttribute("data-value");

    if (buttonValue === "=") {
        try {
            const calculation = currentInput;
            const result = eval(currentInput);
            currentInput = result.toString();
            updateDisplay(currentInput);
            addToHistory(calculation, result);
        } catch (error) {
            updateDisplay('Error');
            currentInput = '';
        }
    } else if (buttonValue === "C") {
        currentInput = '';
        updateDisplay('');
    } else if (buttonValue === "DEL") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    } else if (buttonValue === "%") {
        try {
            const calculation = currentInput + '%';
            const result = eval(currentInput) / 100;
            currentInput = result.toString();
            updateDisplay(currentInput);
            addToHistory(calculation, result);
        } catch (error) {
            updateDisplay('Error');
            currentInput = '';
        }
    } else {
        currentInput += buttonValue;
        updateDisplay(currentInput);
    }
}

buttons.forEach(button => {
    button.addEventListener('click', handleClick);
});

// Keyboard Support
document.addEventListener('keydown', function (event) {
    const key = event.key;
    let buttonValue = '';

    if (key === 'Enter') {
        buttonValue = "=";
    } else if (key === 'Backspace') {
        buttonValue = "DEL";
    } else if (key.toLowerCase() === 'c') {
        buttonValue = "C";
    } else if (/[0-9+\-*/%.]/.test(key)) {
        buttonValue = key;
    }

    if (buttonValue) {
        const button = Array.from(buttons).find(btn => btn.getAttribute("data-value") === buttonValue);

        if (button) {
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 100);

            if (buttonValue === "=") {
                try {
                    const calculation = currentInput;
                    const result = eval(currentInput);
                    currentInput = result.toString();
                    updateDisplay(currentInput);
                    addToHistory(calculation, result);
                } catch (error) {
                    updateDisplay('Error');
                    currentInput = '';
                }
            } else if (buttonValue === "DEL") {
                currentInput = currentInput.slice(0, -1);
                updateDisplay(currentInput);
            } else if (buttonValue === "C") {
                currentInput = '';
                updateDisplay('');
            } else {
                currentInput += buttonValue;
                updateDisplay(currentInput);
            }
        }
    }
});

//  calc button sound js

const buttonSounds = {
    '0': new Audio('/audio/0.mp3'),
    '1': new Audio('/audio/1.mp3'),
    '2': new Audio('/audio/2.mp3'),
    '3': new Audio('/audio/3.mp3'),
    '4': new Audio('/audio/4.mp3'),
    '5': new Audio('/audio/5.mp3'),
    '6': new Audio('/audio/6.mp3'),
    '7': new Audio('/audio/7.mp3'),
    '8': new Audio('/audio/8.mp3'),
    '9': new Audio('/audio/9.mp3'),
    '.': new Audio('/audio/dot.mp3'),
    '+': new Audio('/audio/arithmetic.mp3'),
    '-': new Audio('/audio/arithmetic.mp3'),
    '*': new Audio('/audio/arithmetic.mp3'),
    '/': new Audio('/audio/arithmetic.mp3'),
    '%': new Audio('/audio/arithmetic.mp3'),
    '=': new Audio('/audio/equal.mp3'),
    'C': new Audio('/audio/clear.mp3'),
    'c': new Audio('/audio/clear.mp3'),
    'DEL': new Audio('/audio/backspace.mp3'),
    'Enter': new Audio('/audio/equal.mp3'),
    'Backspace': new Audio('/audio/backspace.mp3'),
};

// Function to play the sound based on button value
function playSoundForButton(buttonValue) {
    const sound = buttonSounds[buttonValue];
    if (sound) {
        sound.play();
    }
}

// Attach event listeners to play sound on button click
const beep = document.querySelectorAll('.btn');

beep.forEach(button => {
    button.addEventListener('click', () => {
        const buttonValue = button.getAttribute("data-value");
        playSoundForButton(buttonValue);
    });
});

// Attach event listener to play sound on keypress
document.addEventListener('keydown', function (event) {
    const key = event.key;

    // If the key pressed matches a button value, play its corresponding sound
    if (buttonSounds[key]) {
        playSoundForButton(key);
    }
});


// dark/light toggle js 

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector('.input'); // Get the switch input element
    const body = document.body; // The body of the page

    // Check for the saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');

    // If a theme is saved, apply it
    if (savedTheme === 'dark') {
        body.style.backgroundColor = "#1a2a47"; // Apply dark theme
        toggle.checked = true; // Set the toggle to the moon (dark mode)
    } else {
        body.style.backgroundColor = "white"; // Apply light theme
        toggle.checked = false; // Set the toggle to the sun (light mode)
    }

    // Add event listener to handle background color change when toggle switch is clicked
    toggle.addEventListener('change', function () {
        if (toggle.checked) {
            body.style.backgroundColor = "#1a2a47"; // Dark theme
            localStorage.setItem('theme', 'dark'); // Save dark theme in localStorage
        } else {
            body.style.backgroundColor = "white"; // Light theme
            localStorage.setItem('theme', 'light'); // Save light theme in localStorage
        }
    });
});

// responsive navbar js

document.getElementById("hamburger").addEventListener("click", function () {
    const navLinks = document.getElementById("slider-links");
    const hamburger = document.getElementById("hamburger");

    // Toggle the sliding menu and hamburger animation
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// slider navlink active js

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".slider-active"); // Adjust selector as needed
    const currentPage = window.location.pathname.split("/").pop(); // Get current page filename

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.style.color = "white";  // Active link color
        } else {
            link.style.color = "lightgray"; // Non-active links color
        }
    });
});
