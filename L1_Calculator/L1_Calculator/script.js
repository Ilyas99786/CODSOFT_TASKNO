const result = document.getElementById("result");
const expression = document.getElementById("expression");
const historyList = document.getElementById("historyList");
const historyPanel = document.getElementById("historyPanel");
let currentInput = "";
let history = [];

const operators = ["+", "-", "*", "/", "%"];

function formatExpression(value) {
  return value.replaceAll("*", " × ").replaceAll("/", " ÷ ").replaceAll("-", " − ").replaceAll("+", " + ");
}

function updateDisplay() {
  result.textContent = currentInput || "0";
  expression.textContent = currentInput ? formatExpression(currentInput) : "Ready to calculate";
}

function addValue(value) {
  const last = currentInput.slice(-1);

  if (operators.includes(value)) {
    if (!currentInput && value !== "-") return;
    if (operators.includes(last)) {
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }
  } else if (value === ".") {
    const parts = currentInput.split(/[+\-*/%]/);
    if (!parts[parts.length - 1].includes(".")) currentInput += value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function calculate() {
  if (!currentInput) return;

  try {
    const safeExpression = currentInput.replace(/%/g, "/100");
    if (!/^[0-9+\-*/.()\s]+$/.test(safeExpression)) throw new Error("Invalid");
    const answer = Function('"use strict"; return (' + safeExpression + ')')();

    if (!Number.isFinite(answer)) throw new Error("Math error");

    const finalAnswer = Number.isInteger(answer)
      ? answer
      : parseFloat(answer.toFixed(8));

    addHistory(currentInput, finalAnswer);
    expression.textContent = formatExpression(currentInput) + " =";
    result.textContent = finalAnswer;
    currentInput = String(finalAnswer);
  } catch {
    expression.textContent = "Invalid calculation";
    result.textContent = "Error";
    currentInput = "";
  }
}

function addHistory(exp, answer) {
  history.unshift({ exp, answer });
  if (history.length > 8) history.pop();
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = '<p class="empty-history">Your calculations will appear here.</p>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <small>${formatExpression(item.exp)}</small>
      <strong>= ${item.answer}</strong>
    </div>
  `).join("");
}

function handleAction(action) {
  if (action === "clear") {
    currentInput = "";
    updateDisplay();
  } else if (action === "delete") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (action === "calculate") {
    calculate();
  }
}

document.querySelectorAll(".key").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;
    if (value !== undefined) addValue(value);
    if (action) handleAction(action);
  });
});

document.addEventListener("keydown", event => {
  const key = event.key;
  if (/^[0-9]$/.test(key) || operators.includes(key) || key === ".") addValue(key);
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") handleAction("delete");
  else if (key === "Escape") handleAction("clear");
});

document.getElementById("historyToggle").addEventListener("click", () => historyPanel.classList.toggle("open"));
document.getElementById("closeHistory").addEventListener("click", () => historyPanel.classList.remove("open"));
document.getElementById("clearHistory").addEventListener("click", () => {
  history = [];
  renderHistory();
});

updateDisplay();