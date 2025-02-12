// leetcode.js

// Example stats (adjust as needed)
const contestRating = 1584;
const globalRank = "168,092 / 6,668,586";
const topPercent = "25.16%";

const totalQuestions = 335;
const easyCount = 186;
const mediumCount = 107;
const hardCount = 8;

// Insert data into the DOM
document.getElementById("contest-rating").textContent = contestRating;
document.getElementById("global-rank").textContent = globalRank;
document.getElementById("top-percent").textContent = topPercent;

document.getElementById("total-questions").textContent = totalQuestions;
document.getElementById("easy-count").textContent = easyCount;
document.getElementById("medium-count").textContent = mediumCount;
document.getElementById("hard-count").textContent = hardCount;

// Difficulty chart
const canvas = document.getElementById("difficultyChart");
const ctx = canvas.getContext("2d");

// Data arrays
const data = [easyCount, mediumCount, hardCount];
const labels = ["Easy", "Medium", "Hard"];
const colors = ["#4CAF50", "#FFC107", "#F44336"]; // Green, Orange, Red

// Chart dimensions
const chartWidth = canvas.width;
const chartHeight = canvas.height;
const barWidth = 50;
const barSpacing = 40;
const maxDataValue = Math.max(...data);
const scaleFactor = (chartHeight - 50) / maxDataValue;

// Draw bars
let xPos = 50;
ctx.textAlign = "center";
ctx.font = "14px sans-serif";

for (let i = 0; i < data.length; i++) {
  const barHeight = data[i] * scaleFactor;
  // Bar
  ctx.fillStyle = colors[i];
  ctx.fillRect(xPos, chartHeight - barHeight - 30, barWidth, barHeight);

  // Value label above bar
  ctx.fillStyle = "#ffffff";
  ctx.fillText(data[i], xPos + barWidth / 2, chartHeight - barHeight - 35);

  // Label below bar
  ctx.fillText(labels[i], xPos + barWidth / 2, chartHeight - 10);

  xPos += barWidth + barSpacing;
}

// Expand/Collapse sidebar using the image button
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("expanded");
});
