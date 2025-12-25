const doneBtn = document.getElementById("doneBtn");
const streakEl = document.getElementById("streak");
const dayEl = document.getElementById("day");
const messageEl = document.getElementById("message");
const missedEl = document.getElementById("missed");

const task1 = document.getElementById("task1");
const task2 = document.getElementById("task2");

let streak = Number(localStorage.getItem("streak")) || 0;
let lastDone = localStorage.getItem("lastDone");
let today = new Date().toDateString();

function daysBetween(d1, d2) {
  return (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24);
}

// Disable button initially
doneBtn.disabled = true;

// Enable button only if both tasks are checked
function checkTasks() {
  doneBtn.disabled = !(task1.checked && task2.checked);
}

task1.addEventListener("change", checkTasks);
task2.addEventListener("change", checkTasks);

// If a day was missed
if (lastDone && daysBetween(lastDone, today) > 1) {
  missedEl.innerHTML = `
    <p>You broke the streak.</p>
    <input id="reason" placeholder="Why did you skip?" />
    <br><br>
    <button onclick="resetStreak()">CONTINUE</button>
  `;
  doneBtn.style.display = "none";
}

function resetStreak() {
  const reason = document.getElementById("reason").value;
  if (!reason) return alert("Be honest. Write the reason.");

  localStorage.setItem("streak", 0);
  localStorage.setItem("lastDone", null);
  location.reload();
}

// Show streak
streakEl.innerText = `Current Streak: ${streak} 🔥`;
dayEl.innerText = `Day: ${streak + 1}`;

// If already completed today
if (lastDone === today) {
  doneBtn.disabled = true;
  task1.disabled = true;
  task2.disabled = true;
  messageEl.innerText = "Good. Come back tomorrow.";
}

// Button click
doneBtn.onclick = () => {
  if (!(task1.checked && task2.checked)) return;

  streak++;
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDone", today);

  doneBtn.disabled = true;
  task1.disabled = true;
  task2.disabled = true;

  messageEl.innerText = "Good. Come back tomorrow.";
};
