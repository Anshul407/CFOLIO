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
    console.log(data.result[2]);
    document.getElementById("max-rating").textContent = data.result[0].maxRating;
    document.getElementById("user-rank").textContent = data.result[0].rank;
    await contestValue();
    await userDetails();

}
let rating;
let contestValue=async()=>{
  let cur=await fetch(url2);
  let data=await cur.json();
  document.getElementById("contests-participated").textContent = data.result.length;

  document.getElementById("div1-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 1)")).length;
  document.getElementById("div2-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 2)")).length;
  document.getElementById("div3-contests").textContent = data.result.filter(contest => contest.contestName.includes("(Div. 3)")).length;

  document.getElementById("anshulcontest").textContent = data.result?.map(item => item.newRating) || [];
  rating=data.result?.map(item => item.newRating) || [];
  // console.log(newRatings);

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


