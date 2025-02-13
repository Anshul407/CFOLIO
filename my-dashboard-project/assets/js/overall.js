// overall.js

// --- Aggregated Overall Metrics (Example Values) ---
const aggregateRating = 1950;
const overallRanking = "150 / 10,000,000";
const topPercentile = "2.5%";

// Aggregated problem counts
const totalSolved = 550;     // (e.g., LeetCode + Codeforces + Others)
const leetcodeSolved = 335;
const codeforcesSolved = 210;
const otherSolved = 5;

// Insert metrics into the DOM
document.getElementById("aggregate-rating").textContent = aggregateRating;
document.getElementById("overall-ranking").textContent = overallRanking;
document.getElementById("top-percentile").textContent = topPercentile;

document.getElementById("total-solved").textContent = totalSolved;
document.getElementById("leetcode-solved").textContent = leetcodeSolved;
document.getElementById("codeforces-solved").textContent = codeforcesSolved;
document.getElementById("other-solved").textContent = otherSolved;

// --- Fetch Data from LeetCode GraphQL API ---
async function fetchLeetCodeData() {
    const query = `
    {
        matchedUser(username: "22147407") {
            submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }`;

    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
}

// --- Overall Performance Chart ---
function drawChart(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart margins and dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;

    // Determine min and max values for scaling
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const xStep = chartWidth / (data.length - 1);
    const yScale = chartHeight / (maxValue - minValue);

    // Draw axes
    ctx.strokeStyle = "#777";
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.stroke();

    // Plot the performance data as a line chart
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = margin.left + index * xStep;
        const y = canvas.height - margin.bottom - ((value - minValue) * yScale);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

// --- Initialize Charts ---
async function initializeCharts() {
    const performanceData = [1800, 1850, 1900, 1950, 1920, 2000];
    drawChart("overallChart", performanceData, "#00ACC1");

    const leetCodeData = await fetchLeetCodeData();
    const dailySubmissions = leetCodeData.map(entry => entry.submissions);
    drawChart("leetCodeChart", dailySubmissions, "#FF6F00");
}

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
        });
    });

    initializeCharts();
});
