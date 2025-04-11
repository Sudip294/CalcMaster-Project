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


// age count js 


let ageInterval;
let history = JSON.parse(localStorage.getItem('ageHistory')) || [];  // Load history from localStorage or initialize empty array

function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    const firstName = document.getElementById('firstName').value;

    if (ageInterval) {
        clearInterval(ageInterval);
    }

    if (!firstName || !birthDate) {
        alert("Please enter both your name and date of birth.");
        return;
    }

    function updateAge() {
        const now = new Date();
        const diff = now - birthDate;

        const years = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();

        let ageYears = years;
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
            ageYears--;
        }

        let months = now.getMonth() - birthDate.getMonth();
        if (months < 0) months += 12;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24) % 30.44);
        const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
        const minutes = Math.floor(diff / (1000 * 60) % 60);
        const seconds = Math.floor(diff / 1000 % 60);

        document.getElementById('ageDisplay').textContent = ageYears;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;

        return { ageYears, months, days, hours, minutes, seconds };
    }

    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.textContent = `Congrats, ${firstName}! You turned`;
    congratsMessage.classList.add('show');

    const ageData = updateAge();

    const historyEntry = {
        id: Date.now(), // Add unique ID for deletion
        name: firstName,
        birthDate: birthDate.toISOString(),
        calculatedAt: new Date().toISOString(),
        age: ageData
    };

    // Add new entry to beginning of history array
    history.unshift(historyEntry);

    // Keep only the 10 most recent entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    // Save updated history to localStorage
    localStorage.setItem('ageHistory', JSON.stringify(history));

    ageInterval = setInterval(updateAge, 1000);
}

function deleteHistoryEntry(id) {
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('ageHistory', JSON.stringify(history));
    showHistory(); // Refresh the history display
}

function showHistory() {
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');

    historyList.innerHTML = history.map(entry => {
        const date = new Date(entry.calculatedAt);
        return `
      <div class="history-item">
        <div class="history-content">
          <strong>${entry.name}</strong> - ${date.toLocaleDateString()}<br>
          Age: ${entry.age.ageYears} years, ${entry.age.months} months, ${entry.age.days} days
        </div>
        <i class="fas fa-trash delete-icon" onclick="deleteHistoryEntry(${entry.id})"></i>
      </div>
    `;
    }).join('');

    modal.style.display = 'block';
}

function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}

window.calculateAge = calculateAge;
window.showHistory = showHistory;
window.closeHistory = closeHistory;
window.deleteHistoryEntry = deleteHistoryEntry;