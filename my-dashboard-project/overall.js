// overall.js

// Example combined data
// (Adjust or pull from your own sources as needed)
const totalLeetCode = 395;   // from leetcode.js
const totalCodeforces = 120; // from codeforces.js
const overallTotal = totalLeetCode + totalCodeforces;
const combinedRating = 1450;
const activeDays = 120;
const currentStreak = 17;

// Update DOM with stats
document.getElementById('overall-total').textContent = overallTotal;
document.getElementById('combined-rating').textContent = combinedRating;
document.getElementById('active-days').textContent = activeDays;
document.getElementById('current-streak').textContent = currentStreak;

// Activity data (dummy values for demonstration)
const activityData = [5, 10, 3, 7, 12, 8, 15];

// Draw a simple line chart using Canvas
const canvas = document.getElementById('activityChart');
const ctx = canvas.getContext('2d');

const chartWidth = canvas.width;
const chartHeight = canvas.height;
const maxActivity = Math.max(...activityData);
const scaleFactor = (chartHeight - 50) / maxActivity;

const pointSpacing = 50;
const xStart = 50;
let xPos = xStart;

ctx.strokeStyle = '#6c63ff'; // use the accent color
ctx.lineWidth = 2;
ctx.beginPath();

// Draw the line
for (let i = 0; i < activityData.length; i++) {
  const y = chartHeight - activityData[i] * scaleFactor - 30;
  if (i === 0) {
    ctx.moveTo(xPos, y);
  } else {
    ctx.lineTo(xPos, y);
  }
  xPos += pointSpacing;
}
ctx.stroke();

// Draw small circles at each data point
xPos = xStart;
for (let i = 0; i < activityData.length; i++) {
  const y = chartHeight - activityData[i] * scaleFactor - 30;
  ctx.fillStyle = '#6c63ff';
  ctx.beginPath();
  ctx.arc(xPos, y, 4, 0, Math.PI * 2);
  ctx.fill();
  xPos += pointSpacing;
}

// Handle sidebar toggle (for mobile view)
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburgerBtn');

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
