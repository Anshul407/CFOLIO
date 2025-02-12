// codeforces.js

// --- Data for Codeforces Metrics (Example values) ---
const currentRating = 2100;
const maxRating = 2300;
const userRank = "Candidate Master";
const contestsParticipated = 45;

const div1Contests = 10;
const div2Contests = 25;
const div3Contests = 10;
const problemsSolved = 120;

// Insert metrics into the DOM
document.getElementById("current-rating").textContent = currentRating;
document.getElementById("max-rating").textContent = maxRating;
document.getElementById("user-rank").textContent = userRank;
document.getElementById("contests-participated").textContent = contestsParticipated;

document.getElementById("div1-contests").textContent = div1Contests;
document.getElementById("div2-contests").textContent = div2Contests;
document.getElementById("div3-contests").textContent = div3Contests;
document.getElementById("problems-solved").textContent = problemsSolved;

// --- Rating History Chart ---
// Dummy rating history data (e.g., rating after each contest)
const ratingHistory = [2000, 2050, 2100, 2150, 2120, 2300];

const canvas = document.getElementById("ratingHistoryChart");
const ctx = canvas.getContext("2d");

// Clear the canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Chart margins and dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const chartWidth = canvas.width - margin.left - margin.right;
const chartHeight = canvas.height - margin.top - margin.bottom;

// Determine min and max rating values for scaling
const minRating = Math.min(...ratingHistory);
const maxRatingValue = Math.max(...ratingHistory);

// Calculate steps for x and y axes
const xStep = chartWidth / (ratingHistory.length - 1);
const yScale = chartHeight / (maxRatingValue - minRating);

// Draw axes
ctx.strokeStyle = "#777";
ctx.beginPath();
ctx.moveTo(margin.left, margin.top);
ctx.lineTo(margin.left, canvas.height - margin.bottom);
ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
ctx.stroke();

// Plot the rating history as a line chart
ctx.strokeStyle = "#D42027"; // Codeforces red accent
ctx.lineWidth = 2;
ctx.beginPath();
ratingHistory.forEach((rating, index) => {
  const x = margin.left + index * xStep;
  const y = canvas.height - margin.bottom - ((rating - minRating) * yScale);
  if (index === 0) {
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
  }
});
ctx.stroke();

document.addEventListener("DOMContentLoaded", function() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleBtn");

  // Toggle sidebar only when the toggle button is clicked
  toggleBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    sidebar.classList.toggle("expanded");
  });

  // Prevent nav link clicks from toggling the sidebar
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.stopPropagation();
      // Optional: You can also prevent the default action if desired:
      // e.preventDefault();
    });
  });
});


