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

// bmi js


// Initialize BMI history from localStorage
let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];

// History modal elements
const historyIcon = document.getElementById('historyIcon');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');

// Show history modal
historyIcon.addEventListener('click', () => {
  updateHistoryDisplay();
  historyModal.classList.remove('hidden');
  setTimeout(() => historyModal.classList.add('show'), 10);
});

// Close history modal
closeHistory.addEventListener('click', () => {
  historyModal.classList.remove('show');
  setTimeout(() => historyModal.classList.add('hidden'), 300);
});

// Close modal when clicking outside
historyModal.addEventListener('click', (e) => {
  if (e.target === historyModal) {
    historyModal.classList.remove('show');
    setTimeout(() => historyModal.classList.add('hidden'), 300);
  }
});

// Make deleteHistoryItem function globally accessible
window.deleteHistoryItem = function (index) {
  bmiHistory.splice(index, 1);
  localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
  updateHistoryDisplay();
};

// Update history display
function updateHistoryDisplay() {
  historyList.innerHTML = '';
  if (bmiHistory.length === 0) {
    historyList.innerHTML = '<div class="history-item">No BMI calculations yet</div>';
    return;
  }

  bmiHistory.forEach((record, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <div class="history-item-content">
        <div class="history-details">
          <p><strong>${record.name}</strong> - ${record.date}</p>
          <p>BMI: ${record.bmi} (${record.category})</p>
          <p>Height: ${record.heightFeet}'${record.heightInches}" | Weight: ${record.weight}kg</p>
        </div>
        <button class="delete-history" onclick="deleteHistoryItem(${index})" title="Delete">
        <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    historyList.appendChild(historyItem);
  });
}

document.getElementById('bmiForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = parseFloat(document.getElementById('age').value);
  const heightFeet = parseFloat(document.getElementById('heightFeet').value);
  const heightInches = parseFloat(document.getElementById('heightInches').value);
  const weight = parseFloat(document.getElementById('weight').value);

  // Convert height to centimeters
  const totalHeightInches = (heightFeet * 12) + heightInches;
  const heightInCm = totalHeightInches * 2.54;

  // Calculate BMI
  const heightInMeters = heightInCm / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const bmiRounded = bmi.toFixed(1);

  // Determine BMI category and pointer position
  let category;
  let pointerPosition;

  if (bmi < 18.5) {
    category = 'Underweight';
    pointerPosition = (bmi / 18.5) * 25;
  } else if (bmi < 25) {
    category = 'Normal weight';
    pointerPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
  } else if (bmi < 30) {
    category = 'Overweight';
    pointerPosition = 50 + ((bmi - 25) / 5) * 25;
  } else {
    category = 'Obese';
    pointerPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
  }

  // Save to history
  const bmiRecord = {
    name,
    gender,
    age,
    heightFeet,
    heightInches,
    weight,
    bmi: bmiRounded,
    category,
    date: new Date().toLocaleString()
  };

  bmiHistory.unshift(bmiRecord); // Add to beginning of array
  if (bmiHistory.length > 10) bmiHistory.pop(); // Keep only last 10 records
  localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));

  // Display result
  const resultDiv = document.getElementById('result');
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const meterPointer = document.getElementById('meterPointer');

  bmiValue.textContent = `${name}, your BMI is ${bmiRounded}`;
  bmiCategory.textContent = `Category: ${category}`;

  // Update meter pointer position
  meterPointer.style.left = `${pointerPosition}%`;

  resultDiv.classList.remove('hidden');
  // Trigger animation
  setTimeout(() => {
    resultDiv.classList.add('show');
  }, 10);
});


