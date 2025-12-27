const mainScreen = document.getElementById("mainScreen");
const historyScreen = document.getElementById("historyScreen");
const openHistory = document.getElementById("openHistory");
const backToMain = document.getElementById("backToMain");

const doneBtn = document.getElementById("doneBtn");
const streakEl = document.getElementById("streak");
const dayEl = document.getElementById("day");
const messageEl = document.getElementById("message");
const missedEl = document.getElementById("missed");

const pushSets = document.querySelectorAll(".push-set");

const task2 = document.getElementById("task2");
// Water elements
const waterStatus = document.getElementById("waterStatus");
const water300 = document.getElementById("water300");
const water600 = document.getElementById("water600");
const waterRemove = document.getElementById("waterRemove");

let streak = Number(localStorage.getItem("streak")) || 0;
let lastDone = localStorage.getItem("lastDone");
let today = new Date().toDateString();
// Water data (stored in phone memory)
let dailyWater = Number(localStorage.getItem("dailyWater")) || 0;
let waterHistory = JSON.parse(localStorage.getItem("waterHistory")) || {};
// Auto reset tasks if it's a new day
let lastOpenDate = localStorage.getItem("lastOpenDate");

if (lastOpenDate !== today) {
  // Save yesterday's water into history
if (lastOpenDate) {
  waterHistory[lastOpenDate] = dailyWater;
  localStorage.setItem("waterHistory", JSON.stringify(waterHistory));
}
  // New day detected
  pushSets.forEach(set => {
  set.checked = false;
  set.disabled = false;
});

  task2.checked = false;
  
  task2.disabled = false;
  doneBtn.disabled = true;
  messageEl.innerText = "";
    // Reset water for new day
  dailyWater = 0;
  localStorage.setItem("dailyWater", 0);

  localStorage.setItem("lastOpenDate", today);
}


function daysBetween(d1, d2) {
  return (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24);
}

// Disable button initially
doneBtn.disabled = true;

// Enable button only if both tasks are checked
function allPushSetsDone() {
  return [...pushSets].every(set => set.checked);
}

function checkTasks() {
  doneBtn.disabled = !(allPushSetsDone() && task2.checked);
}

pushSets.forEach(set => {
  set.addEventListener("change", checkTasks);
});

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
  pushSets.forEach(set => set.disabled = true);

  task2.disabled = true;
  messageEl.innerText = "Good. Come back tomorrow.";
}

// Button click
doneBtn.onclick = () => {
  // Safety check
  if (!(allPushSetsDone() && task2.checked)) return;

  streak += 1;
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDone", today);

  doneBtn.disabled = true;

  // Disable all tasks
  pushSets.forEach(set => set.disabled = true);
  task2.disabled = true;

  messageEl.innerText = "Good. Come back tomorrow.";
};

// ===== WATER TRACKING =====

// Update water text on screen
function updateWaterUI() {
  waterStatus.innerText = `Today: ${dailyWater} ml / 2500 ml`;
}

// +300 ml
water300.onclick = () => {
  dailyWater += 300;
  localStorage.setItem("dailyWater", dailyWater);
  updateWaterUI();
};

// +600 ml
water600.onclick = () => {
  dailyWater += 600;
  localStorage.setItem("dailyWater", dailyWater);
  updateWaterUI();
};

// −300 ml (undo)
waterRemove.onclick = () => {
  dailyWater = Math.max(0, dailyWater - 300);
  localStorage.setItem("dailyWater", dailyWater);
  updateWaterUI();
};

// Show water when app opens
updateWaterUI();
openHistory.onclick = () => {
  mainScreen.style.display = "none";
  historyScreen.style.display = "block";
  renderCalendar();
};

backToMain.onclick = () => {
  historyScreen.style.display = "none";
  mainScreen.style.display = "block";
};
const calendar = document.getElementById("calendar");
const historyMonth = document.getElementById("historyMonth");

function renderCalendar() {
  calendar.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  historyMonth.innerText = now.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = new Date(year, month, day).toDateString();
    const ml = waterHistory[dateKey] || 0;

    const box = document.createElement("div");
    box.className = "day-cell";
    box.innerText = `${day}\n${ml} ml`;

    calendar.appendChild(box);
  }
}
