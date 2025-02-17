// codeforces.js
let useridElement = document.getElementsByClassName('user-handle');
let url = 'https://codeforces.com/api/user.info?handles=anshul407&checkHistoricHandles=false';
let url2='https://codeforces.com/api/user.rating?handle=anshul407';
let url3='https://codeforces.com/api/user.status?handle=anshul407';
if (useridElement.length > 0) {
  let userid = useridElement[0].innerText.trim(); 
  
  url = `https://codeforces.com/api/user.info?handles=${userid}&checkHistoricHandles=false`;
  url2= `https://codeforces.com/api/user.rating?handle=${userid}`;
  url3=`https://codeforces.com/api/user.status?handle=${userid}`;
  console.log(url);
}

// Insert metrics into the DOM
let assignValue=async()=>{
    let cur=await fetch(url);
    let data=await cur.json();
    document.getElementById("current-rating").textContent = data.result[0].rating;
    document.getElementById("max-rating").textContent = data.result[0].maxRating;
    document.getElementById("user-rank").textContent = data.result[0].rank;
    await contestValue();
    await userDetails();
}

let rating = [];
let contestValue=async()=>{
  let cur=await fetch(url2);
  let data=await cur.json();
  document.getElementById("contests-participated").textContent = data.result.length;

  document.getElementById("div1-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 1)")).length;
  document.getElementById("div2-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 2)")).length;
  document.getElementById("div3-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 3)")).length;

  rating = data.result.map(item => item.newRating) || [];
  drawLineGraph(rating);
}

let userDetails=async()=>{
  let cur=await fetch(url3);
  let data=await cur.json();
  const okSubmissions = data.result.filter(sub => sub.verdict === "OK");
  const uniqueProblems = new Set(okSubmissions.map(sub => `${sub.problem.contestId}-${sub.problem.index}`));
  document.getElementById("problems-solved").textContent = uniqueProblems.size;
}
assignValue();

// --- Rating History Chart ---
function drawLineGraph(ratings) {
  if (ratings.length > 30) {
    ratings = ratings.slice(-30);
}
  const canvas = document.getElementById("ratingHistoryChart");
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
const body = document.querySelector("body"),
sidebar = body.querySelector("nav"),
toggle = body.querySelector(".toggle"),

modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
body.classList.toggle("dark");

if (body.classList.contains("dark")) {
  modeText.innerText = "Light mode";
} else {
  modeText.innerText = "Dark mode";
}
});
