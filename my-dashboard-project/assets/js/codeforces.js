// codeforces.js

// Define API endpoints based on the user-handle element value.
let useridElement = document.getElementsByClassName('user-handle');
let url = 'https://codeforces.com/api/user.info?handles=anshul407&checkHistoricHandles=false';
let url2 = 'https://codeforces.com/api/user.rating?handle=anshul407';
let url3 = 'https://codeforces.com/api/user.status?handle=anshul407';

if (useridElement.length > 0) {
  let userid = useridElement[0].innerText.trim();
  url = `https://codeforces.com/api/user.info?handles=${userid}&checkHistoricHandles=false`;
  url2 = `https://codeforces.com/api/user.rating?handle=${userid}`;
  url3 = `https://codeforces.com/api/user.status?handle=${userid}`;
}

/* 
  1) Helper: getColorByRating(rating)
     Returns the official CF color for a given rating.
*/
function getColorByRating(rating) {
  if (rating >= 2900) return "#FF0000";  // Legendary Grandmaster (Red)
  if (rating >= 2600) return "#FF0000";  // Int'l Grandmaster (Red)
  if (rating >= 2400) return "#FF0000";  // Grandmaster (Red)
  if (rating >= 2300) return "#FF8C00";  // Int'l Master (Orange)
  if (rating >= 2100) return "#FF8C00";  // Master (Orange)
  if (rating >= 1900) return "#AA00AA";  // Candidate Master (Violet)
  if (rating >= 1600) return "#0000FF";  // Expert (Blue)
  if (rating >= 1400) return "#03A89E";  // Specialist (Cyan)
  if (rating >= 1200) return "#008000";  // Pupil (Green)
  return "#808080";                      // Newbie (Gray)
}

/* 
  2) Helper: getRankByRating(rating)
     Returns the official CF rank title for a given rating.
*/
function getRankByRating(rating) {
  if (rating >= 2900) return "Legendary Grandmaster";
  if (rating >= 2600) return "International Grandmaster";
  if (rating >= 2400) return "Grandmaster";
  if (rating >= 2300) return "International Master";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  return "Newbie";
}

/* 3) Fetch user info (current rating, max rating), then color them based on rating. */
async function fetchUserInfo() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const user = data.result[0];
    
    // DOM elements for rating, max rating, rank
    const currentRatingElem = document.getElementById("current-rating");
    const maxRatingElem     = document.getElementById("max-rating");
    const userRankElem      = document.getElementById("user-rank");
    
    // Handle current rating
    const currentRating = user.rating || 0; 
    currentRatingElem.textContent = currentRating; 
    currentRatingElem.style.color = getColorByRating(currentRating);
    
    // Also set the rank text/color from the current rating
    const derivedCurrentRank = getRankByRating(currentRating);
    userRankElem.textContent = derivedCurrentRank;
    userRankElem.style.color = getColorByRating(currentRating);

    // Handle max rating
    const maxRating = user.maxRating || 0;
    maxRatingElem.textContent = maxRating;
    maxRatingElem.style.color = getColorByRating(maxRating);

    // Show the rank that corresponds to the max rating on hover (simple HTML title tooltip)
    const derivedMaxRank = getRankByRating(maxRating);
    maxRatingElem.setAttribute("title", derivedMaxRank);

  } catch (err) {
    console.error("Error fetching user info:", err);
  }
}

/* 4) Fetch rating info & contest data, then render the rating history and bar chart. */
async function fetchRatingInfo() {
  try {
    const res = await fetch(url2);
    const data = await res.json();
    const results = data.result || [];
    
    document.getElementById("contests-participated").textContent = results.length;
    
    // Prepare rating history data for ApexCharts.
    let ratings = results.map(item => item.newRating);
    renderRatingHistoryApex(ratings);
    
    // Calculate contest participation counts.
    let div1 = results.filter(contest => contest.contestName.includes("(Div. 1)")).length;
    let div2 = results.filter(contest => contest.contestName.includes("(Div. 2)")).length;
    let div3 = results.filter(contest => contest.contestName.includes("(Div. 3)")).length;
    let div4 = results.filter(contest => contest.contestName.includes("(Div. 4)")).length;
    renderContestChart(div1, div2, div3, div4);
  } catch (err) {
    console.error("Error fetching rating info:", err);
  }
}

/* 5) Fetch submission status, update stats, and render submission distribution chart. */
async function fetchUserStatus() {
  try {
    const res = await fetch(url3);
    const data = await res.json();
    const submissions = data.result || [];
    const okSubs = submissions.filter(sub => sub.verdict === "OK");
    
    // Unique problems solved
    const uniqueProblems = new Set(okSubs.map(sub => `${sub.problem.contestId}-${sub.problem.index}`));
    document.getElementById("problems-solved").textContent = uniqueProblems.size;
    
    // Total submissions
    document.getElementById("total-submissions").textContent = submissions.length;
    
    // Accuracy calculation
    let accuracy = submissions.length > 0 ? ((okSubs.length / submissions.length) * 100).toFixed(2) : 0;
    document.getElementById("accuracy").textContent = accuracy+"%";
    
    // Submission distribution chart
    renderSubmissionChart(okSubs.length, submissions.length - okSubs.length);
  } catch (err) {
    console.error("Error fetching user status:", err);
  }
}

// Initialize all data fetching
fetchUserInfo();
fetchRatingInfo();
fetchUserStatus();

/* --------------------------------------------------------
   APEXCHARTS: Rating History (Line Chart)
-------------------------------------------------------- */
function renderRatingHistoryApex(ratings) {
    let options = {
      chart: {
        type: 'line',
        /* Let the parent container dictate height */
        height: '90%',
        width: '100%',
        toolbar: { show: false }
      },
      series: [{
        name: 'Rating',
        data: ratings
      }],
      /* ... other ApexCharts settings ... */
    };
    
    let chart = new ApexCharts(document.querySelector('#apexRatingChart'), options);
    chart.render();
  }

/* --------------------------------------------------------
   CHART.JS: Submission Distribution (Doughnut)
-------------------------------------------------------- */
let submissionChart;
function renderSubmissionChart(okCount, notOkCount) {
  const ctx = document.getElementById('submissionChart').getContext('2d');
  if (submissionChart) submissionChart.destroy();
  submissionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Accepted', 'Not Accepted'],
      datasets: [{
        data: [okCount, notOkCount],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

/* --------------------------------------------------------
   CHART.JS: Contest Participation (Bar)
-------------------------------------------------------- */
let contestChart;
function renderContestChart(div1, div2, div3, div4) {
  const ctx = document.getElementById('contestChart').getContext('2d');
  if (contestChart) contestChart.destroy();
  contestChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Div. 1', 'Div. 2', 'Div. 3', 'Div. 4'],
      datasets: [{
        label: 'Contests Participated',
        data: [div1, div2, div3, div4],
        backgroundColor: ['#2196F3', '#FFC107', '#9C27B0', '#4CAF50'] // Added Div. 4 color (Green)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}


/* --------------------------------------------------------
   SIDEBAR & DARK MODE (unchanged)
-------------------------------------------------------- */
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
  modeText.innerText = body.classList.contains("dark") ? "Light mode" : "Dark mode";
});
