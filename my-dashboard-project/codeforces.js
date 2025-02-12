// codeforces.js

// Example data (customize as needed)
const cfRating = 1393;
const cfMaxRating = 1600;
const cfRank = "Newbie";

const totalProblems = 120;
const friendsCount = 5;
const contribution = 0;
const lastOnline = "2 days ago";

// Update DOM elements
document.getElementById("cf-rating").textContent = cfRating;
document.getElementById("cf-max-rating").textContent = cfMaxRating;
document.getElementById("cf-rank").textContent = cfRank;

document.getElementById("total-problems").textContent = totalProblems;
document.getElementById("friends-count").textContent = friendsCount;
document.getElementById("contribution").textContent = contribution;
document.getElementById("last-online").textContent = lastOnline;

// Chart: Problem Difficulty Distribution
const canvas = document.getElementById("cfChart");
const ctx = canvas.getContext("2d");

const difficulties = ["A", "B", "C", "D", "E"];
const solvedCount = [40, 30, 25, 15, 10]; // example distribution

const chartWidth = canvas.width;
const chartHeight = canvas.height;
const barWidth = 40;
const barSpacing = 40;
const maxVal = Math.max(...solvedCount);
const scaleFactor = (chartHeight - 50) / maxVal;

let xPos = 50;
ctx.textAlign = "center";
ctx.font = "14px sans-serif";

for (let i = 0; i < solvedCount.length; i++) {
  const barHeight = solvedCount[i] * scaleFactor;
  // Bar color
  ctx.fillStyle = "#4285F4"; // Codeforces-like blue
  ctx.fillRect(xPos, chartHeight - barHeight - 30, barWidth, barHeight);

  // Value label above bar
  ctx.fillStyle = "#fff";
  ctx.fillText(solvedCount[i], xPos + barWidth / 2, chartHeight - barHeight - 35);

  // Difficulty label below bar
  ctx.fillText(difficulties[i], xPos + barWidth / 2, chartHeight - 10);

  xPos += barWidth + barSpacing;
}

// Sidebar toggle logic (same as LeetCode)
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("expanded");
});
