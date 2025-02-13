let url = 'https://leetcode-api-faisalshohag.vercel.app/';
let useridElement = document.getElementsByClassName('user-handle');
let url2 = 'https://alfa-leetcode-api.onrender.com//contest';

if (useridElement.length > 0) {
    let userid = useridElement[0].innerText.trim(); 
    url = url + userid;
    url2 = `https://alfa-leetcode-api.onrender.com/${userid}/contest`;
    console.log(url);
}

// Default fallback stats (if needed)
const contestRating = 1584;
const globalRank = "168,092 / 6,668,586";
const topPercent = "25.16%";

let easy = 0;
let medium = 0;
let hard = 0;

/* Fetch problem stats and update donut chart */
let assignValue = async () => {
    let cur = await fetch(url);
    let data = await cur.json();

    document.getElementById("total-questions").textContent = data.totalSolved;
    document.getElementById("easy-count").textContent = data.easySolved;
    document.getElementById("medium-count").textContent = data.mediumSolved;
    document.getElementById("hard-count").textContent = data.hardSolved;

    easy = data.easySolved;
    medium = data.mediumSolved;
    hard = data.hardSolved;

    // Update the dynamic donut chart
    updateDonutChart(easy, medium, hard);
};
// Suppose we read from the user-handle element or already have it:
let userHandleElement = document.querySelector(".user-handle");
if (userHandleElement) {
  let actualUsername = userHandleElement.innerText.trim(); // e.g. "22147407"
  let profileLink = document.getElementById("leetcode-profile-link");
  if (profileLink) {
    // Construct the LeetCode profile URL
    profileLink.href = `https://leetcode.com/u/${actualUsername}/`;
    profileLink.textContent = actualUsername;
  }
}

/* Fetch contest stats and update line graph */
let fetchContest = async () => {
  let cur = await fetch(url2);
  let data = await cur.json();
  console.log(cur);

  document.getElementById("contest-rating").textContent = Math.round(data.contestRating);
  document.getElementById("global-rank").textContent = data.contestGlobalRanking;
  document.getElementById("top-percent").textContent = data.contestTopPercentage + "%";

  // Extract ratings from the contest participation array
  let ratings = data.contestParticipation.map(contest => contest.rating);

  drawLineGraph(ratings);  // Draw line graph from ratings
};

// Initiate data fetches
assignValue();
fetchContest();

/**
 * Draws a smooth, curved line chart from an array of ratings.
 * Axis lines and numeric ticks are drawn (without axis labels).
 * The curve is drawn with a Catmull-Rom spline (tension = 0.3) in LeetCode orange,
 * with a gradient fill beneath it. On hover near a data point, a tooltip shows the rating.
 */
function drawLineGraph(ratings) {
  if (ratings.length > 30) {
    ratings = ratings.slice(-30);
}
  const canvas = document.getElementById("contestLineChart");
  if (!canvas) {
      console.error("Canvas with id 'contestLineChart' not found!");
      return;
  }
  const ctx = canvas.getContext("2d");
  
  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!ratings || ratings.length === 0) return;
  
  // Define chart margins
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = canvas.width - margin.left - margin.right;
  const chartHeight = canvas.height - margin.top - margin.bottom;
  
  ctx.save();
  ctx.translate(margin.left, margin.top);
  
  // Determine min and max rating; add 10% padding vertically
  let dataMin = Math.min(...ratings);
  let dataMax = Math.max(...ratings);
  let dataRange = dataMax - dataMin;
  if (dataRange === 0) dataRange = 1;
  const paddingRatio = 0.1;
  let yMin = dataMin - dataRange * paddingRatio;
  let yMax = dataMax + dataRange * paddingRatio;
  if (yMin < 0) yMin = 0;
  
  const scaleY = chartHeight / (yMax - yMin);
  const xStep = chartWidth / (ratings.length - 1);
  
  // Build array of points and store on canvas for tooltip use
  const points = ratings.map((rating, i) => ({
      x: i * xStep,
      y: chartHeight - (rating - yMin) * scaleY,
      rating: rating
  }));
  canvas.points = points;
  
  // Draw axis lines and numeric ticks (no axis labels)
  ctx.strokeStyle = "#666"; // axis color
  ctx.lineWidth = 1;
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, chartHeight);
  ctx.stroke();
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(0, chartHeight);
  ctx.lineTo(chartWidth, chartHeight);
  ctx.stroke();
  
  // Y-axis ticks/numbers
  ctx.fillStyle = "#ccc";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const numYTicks = 5;
  let yStart = Math.floor(yMin);
  let yEnd = Math.ceil(yMax);
  let yTickInterval = Math.ceil((yEnd - yStart) / numYTicks);
  if (yTickInterval < 1) yTickInterval = 1;
  for (let val = yStart; val <= yEnd; val += yTickInterval) {
      const yPos = chartHeight - (val - yMin) * scaleY;
      ctx.beginPath();
      ctx.moveTo(-5, yPos);
      ctx.lineTo(0, yPos);
      ctx.stroke();
      ctx.fillText(val, -10, yPos);
  }
  
  // X-axis ticks/numbers
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i < ratings.length; i++) {
      const xPos = i * xStep;
      ctx.beginPath();
      ctx.moveTo(xPos, chartHeight);
      ctx.lineTo(xPos, chartHeight + 5);
      ctx.stroke();
      ctx.fillText(i + 1, xPos, chartHeight + 8);
  }
  
  // Smooth curve using Catmull-Rom spline with tension 0.3
  const tension = 0.3;
  function catmullRom2bezier(p0, p1, p2, p3, t) {
      const cp1x = p1.x + (p2.x - p0.x) * (t / 6);
      const cp1y = p1.y + (p2.y - p0.y) * (t / 6);
      const cp2x = p2.x - (p3.x - p1.x) * (t / 6);
      const cp2y = p2.y - (p3.y - p1.y) * (t / 6);
      return { cp1x, cp1y, cp2x, cp2y };
  }
  
  // Draw the curve (stroke path only)
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
      const p0 = i === 0 ? points[0] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = (i + 2 < points.length) ? points[i + 2] : points[points.length - 1];
      const { cp1x, cp1y, cp2x, cp2y } = catmullRom2bezier(p0, p1, p2, p3, tension);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  ctx.strokeStyle = "#F89C2C";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw a separate fill path with gradient under the curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
      const p0 = i === 0 ? points[0] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = (i + 2 < points.length) ? points[i + 2] : points[points.length - 1];
      const { cp1x, cp1y, cp2x, cp2y } = catmullRom2bezier(p0, p1, p2, p3, tension);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  ctx.lineTo(points[points.length - 1].x, chartHeight);
  ctx.lineTo(points[0].x, chartHeight);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
  gradient.addColorStop(0, "rgba(248, 156, 44, 0.2)");
  gradient.addColorStop(1, "rgba(248, 156, 44, 0)");
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw circles at each data point
  ctx.fillStyle = "#F89C2C";
  for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
      ctx.fill();
  }
  
  ctx.restore();
  
  // Tooltip: Create tooltip element if it doesn't exist
  if (!canvas.tooltip) {
      const tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.background = "rgba(0, 0, 0, 0.8)";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "4px 8px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "12px";
      tooltip.style.pointerEvents = "none";
      tooltip.style.display = "none";
      document.body.appendChild(tooltip);
      canvas.tooltip = tooltip;
  }
  // Add tooltip event listener once
  if (!canvas.hasTooltipListener) {
      canvas.addEventListener("mousemove", function(e) {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          let foundPoint = null;
          for (let i = 0; i < canvas.points.length; i++) {
              const pt = canvas.points[i];
              const dx = mouseX - pt.x;
              const dy = mouseY - pt.y;
              if (Math.sqrt(dx * dx + dy * dy) < 5) { // 5px threshold
                  foundPoint = pt;
                  break;
              }
          }
          if (foundPoint) {
              canvas.tooltip.textContent = "Rating: " + foundPoint.rating;
              canvas.tooltip.style.left = (rect.left + foundPoint.x + 10) + "px";
              canvas.tooltip.style.top = (rect.top + foundPoint.y - 10) + "px";
              canvas.tooltip.style.display = "block";
          } else {
              canvas.tooltip.style.display = "none";
          }
      });
      canvas.addEventListener("mouseout", function() {
          canvas.tooltip.style.display = "none";
      });
      canvas.hasTooltipListener = true;
  }
}






/* 
   Update the donut chart for difficulty distribution.
   This function calculates the arc lengths based on the fraction of each difficulty
   and updates the corresponding SVG circle elements.
*/
function updateDonutChart(easy, medium, hard) {
    const totalSolved = easy + medium + hard;

    // Update center text and legend
    document.getElementById("donut-total").textContent = `${totalSolved}`;
    document.getElementById("donut-subtitle").textContent = "Solved";

    document.getElementById("easy-legend-count").textContent = `${easy}`;
    document.getElementById("medium-legend-count").textContent = `${medium}`;
    document.getElementById("hard-legend-count").textContent = `${hard}`;

    // Calculate arc lengths based on distribution.
    const RADIUS = 80;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const easyFrac = totalSolved === 0 ? 0 : easy / totalSolved;
    const mediumFrac = totalSolved === 0 ? 0 : medium / totalSolved;
    const hardFrac = totalSolved === 0 ? 0 : hard / totalSolved;

    const easyArcLen = easyFrac * CIRCUMFERENCE;
    const mediumArcLen = mediumFrac * CIRCUMFERENCE;
    const hardArcLen = hardFrac * CIRCUMFERENCE;

    const easyArc = document.querySelector(".easy-segment");
    const mediumArc = document.querySelector(".medium-segment");
    const hardArc = document.querySelector(".hard-segment");

    if (easyArc && mediumArc && hardArc) {
        easyArc.style.strokeDasharray = `${easyArcLen} ${CIRCUMFERENCE}`;
        mediumArc.style.strokeDasharray = `${mediumArcLen} ${CIRCUMFERENCE}`;
        hardArc.style.strokeDasharray = `${hardArcLen} ${CIRCUMFERENCE}`;

        // Position subsequent arcs so that they appear consecutively
        mediumArc.style.strokeDashoffset = `-${easyArcLen}`;
        hardArc.style.strokeDashoffset = `-${(easyArcLen + mediumArcLen)}`;
    }
}

/* Sidebar toggle */
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
});
