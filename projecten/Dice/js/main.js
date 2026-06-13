// ====== ELEMENTEN ======
const balanceEl = document.getElementById("balance");
const betInput = document.getElementById("betInput");
const halfBtn = document.getElementById("halfBtn");
const doubleBtn = document.getElementById("doubleBtn");
const betBtn = document.querySelector(".bet-btn");

const slider = document.getElementById("targetSlider");

const rolledValue = document.getElementById("rolledValue");
const resultStatus = document.getElementById("resultStatus");
const resultBox = document.getElementById("resultBox");
const historyEl = document.getElementById("rollHistory");

const coinValue = document.getElementById("coinValue");
const profitCoin = document.getElementById("profitCoin");
const profitValue = document.getElementById("profitValue");

const multiplierOut = document.getElementById("multiplierOut");
const winChanceOut = document.getElementById("winChanceOut");

const rollModeBox = document.getElementById("rollMode");
const rollModeLabel = rollModeBox.querySelector(".stat-label");
const rollTargetOut = document.getElementById("rollOverOut");

// ====== GAME ======
let balance = 100;
let mode = "over"; // over / under
const HOUSE_EDGE = 0.01; // 1% (zet op 0 als je geen house edge wilt)

// ====== HELPERS ======
function updateBalance() {
  balanceEl.textContent = balance;
}

function addHistory(num, win) {
  const pill = document.createElement("div");
  pill.className = "pill";
  pill.textContent = num;
  pill.style.color = win ? "var(--green)" : "var(--red)";
  historyEl.prepend(pill);

  while (historyEl.children.length > 10) {
    historyEl.removeChild(historyEl.lastChild);
  }
}

function clampTarget(t) {
  // hou marge zodat kans niet 0% of 100% wordt
  if (t < 2) return 2;
  if (t > 97) return 97;
  return t;
}

// win chance voor roll 0..99
function calcWinChance(target) {
  // over: win bij roll > target => target+1..99 => (99-target) uitkomsten
  // under: win bij roll < target => 0..target-1 => target uitkomsten
  const chance = mode === "over" ? (99 - target) / 100 : target / 100;
  return chance; // 0..1
}

function calcMultiplier(chance) {
  if (chance <= 0) return 0;
  const fair = 1 / chance;
  return fair * (1 - HOUSE_EDGE);
}

function updateUI() {
  const bet = Math.max(0, Number(betInput.value) || 0);
  let target = clampTarget(Number(slider.value) || 50);

  coinValue.textContent = bet;

  rollModeLabel.textContent = mode === "over" ? "Roll Over" : "Roll Under";
  rollTargetOut.value = target;

  const chance = calcWinChance(target);
  const multiplier = calcMultiplier(chance);

  // UI outputs
  winChanceOut.value = Math.round(chance * 100); // hele %
  multiplierOut.value = multiplier.toFixed(2);   // multiplier heeft meestal decimals

  // Profit on win (net winst) = bet * (multiplier - 1)
  const profit = Math.max(0, Math.round(bet * (multiplier - 1)));
  profitCoin.textContent = profit;
  profitValue.textContent = profit;
}

// ====== EVENTS ======
halfBtn.addEventListener("click", () => {
  betInput.value = Math.floor((Number(betInput.value) || 0) / 2);
  updateUI();
});

doubleBtn.addEventListener("click", () => {
  betInput.value = (Number(betInput.value) || 0) * 2;
  updateUI();
});

rollModeBox.addEventListener("click", () => {
  mode = mode === "over" ? "under" : "over";
  updateUI();
});

slider.addEventListener("input", updateUI);
betInput.addEventListener("input", updateUI);

// ====== BET / ROLL ======
betBtn.addEventListener("click", () => {
  const bet = Math.max(0, Number(betInput.value) || 0);
  let target = clampTarget(Number(slider.value) || 50);

  if (bet <= 0) {
    resultStatus.textContent = "Bet moet groter dan 0 zijn";
    resultBox.classList.remove("win", "lose");
    return;
  }

  if (bet > balance) {
    resultStatus.textContent = "Niet genoeg balance";
    resultBox.classList.remove("win", "lose");
    return;
  }

  const roll = Math.floor(Math.random() * 100); // 0-99
  rolledValue.textContent = roll;

  let win = false;
  if (mode === "over") win = roll > target;
  else win = roll < target;

  const chance = calcWinChance(target);
  const multiplier = calcMultiplier(chance);

  // Balance update (hele coins)
  balance -= bet;

  if (win) {
    const payout = Math.round(bet * multiplier); // totaal terug
    balance += payout;
  }

  updateBalance();
  addHistory(roll, win);

  resultBox.classList.remove("win", "lose");
  resultBox.classList.add(win ? "win" : "lose");

  const profit = Math.max(0, Math.round(bet * (multiplier - 1)));
  resultStatus.textContent = win ? `WIN +${profit} 🪙` : `LOSE -${bet} 🪙`;

  updateUI();
});

// ====== START ======
updateBalance();
updateUI();
resultStatus.textContent = "Place a bet";
