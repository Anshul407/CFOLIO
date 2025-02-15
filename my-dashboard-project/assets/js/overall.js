// overall.js
let useridElement = document.getElementsByClassName('user-handlecf');
let useridElement2 = document.getElementsByClassName('user-handlelc');
let url = 'https://codeforces.com/api/user.info?handles=anshul407&checkHistoricHandles=false';
let url2='https://codeforces.com/api/user.rating?handle=anshul407';
let url3='https://codeforces.com/api/user.status?handle=anshul407';
let url4 = 'https://leetcode-api-faisalshohag.vercel.app/';
let url5 = 'https://alfa-leetcode-api.onrender.com//contest';
let url6='https://codeforces.com/api/contest.list';

if (useridElement2.length > 0) {
    let userid = useridElement2[0].innerText.trim();
    url4 = url4 + userid;
    url5 = https://alfa-leetcode-api.onrender.com/${userid}/contest;
    console.log(url);
}

if (useridElement.length > 0) {
  let userid = useridElement[0].innerText.trim(); 
  
  url = https://codeforces.com/api/user.info?handles=${userid}&checkHistoricHandles=false;
  url2= https://codeforces.com/api/user.rating?handle=${userid};
  url3=https://codeforces.com/api/user.status?handle=${userid};
  console.log(url);
}
// --- Aggregated Overall Metrics (Example Values) ---
const topPercentile = "2.5%";

// Aggregated problem counts
let totalSolved ;     // (e.g., LeetCode + CodeForces + Others)
let leetcodeSolved ;
let codeforcesSolved ;
let otherSolved = 0;
let aggregateRating = [70, 65, 80, 75, 90, 85, 95, 88, 70, 75, 80, 85, 92, 78, 88, 79, 85, 80, 75, 78, 90, 92, 85, 80, 78, 85, 80, 90, 95, 85];
let overallRanking = [10, 12, 9, 11, 8, 9, 7, 8, 12, 11, 10, 9, 6, 8, 7, 9, 8, 10, 12, 11, 8, 7, 9, 10, 11, 8, 9, 7, 6, 8];

let dailySubmissions = [
  12, 18, 22, 15, 9, 28, 30, 20, 25, 18, 10, 16, 22, 27, 14,
  19, 24, 29, 21, 13, 17, 26, 31, 23, 11, 15, 28, 30, 20, 25
];

// --- New Ratings Data for the Area Chart ---
let leetCodeRating = [];      // Sample data for LeetCode Rating
let codeForcesRating = [];     // Sample data for CodeForces Rating
let assignValue=async()=>{
  let cur1 = await fetch(url4);
  let data1 = await cur1.json();
  let cur2=await fetch(url3);
  let data2=await cur2.json();
  const okSubmissions = data2.result.filter(sub => sub.verdict === "OK");
  const cfProblems = new Set(okSubmissions.map(sub => ${sub.problem.contestId}-${sub.problem.index}));
  const lcProblems=data1.totalSolved;
  totalSolved=cfProblems.size+lcProblems;
  console.log(totalSolved)
  
  leetcodeSolved=lcProblems;
  codeforcesSolved=cfProblems.size;
  document.getElementById("total-solved").textContent = totalSolved;
  document.getElementById("leetcode-solved").textContent = leetcodeSolved;
  document.getElementById("codeforces-solved").textContent = codeforcesSolved;
  document.getElementById("other-solved").textContent = otherSolved;

  // Update charts
  assignContest();
  

}
let assignContest=async()=>{
  let cur = await fetch(url5);
  let data = await cur.json();
  leetCodeRating = data.contestParticipation.map(contest => Math.round(contest.rating));
  let cur2 = await fetch(url2);
  let data2 = await cur2.json();
  let value=data2.result;
  
  ratingHistory = value.map(item => item.newRating);
  if (ratingHistory.length > 30) {
    ratingHistory = ratingHistory.slice(-30);
  }
  codeForcesRating=ratingHistory;
  console.log(codeForcesRating)
  updateChart(totalSolved, leetcodeSolved, codeforcesSolved, otherSolved);
  updateHeatmap(dailySubmissions);
  updateAreaChart(leetCodeRating, codeForcesRating);


}
assignValue();
//
// Insert metrics and update charts once DOM is fully loaded
//
// document.addEventListener("DOMContentLoaded", function() {

//   document.getElementById("total-solved").textContent = totalSolved;
//   document.getElementById("leetcode-solved").textContent = leetcodeSolved;
//   document.getElementById("codeforces-solved").textContent = codeforcesSolved;
//   document.getElementById("other-solved").textContent = otherSolved;

//   // Update charts
//   updateChart(totalSolved, leetcodeSolved, codeforcesSolved, otherSolved);
//   updateAreaChart(leetCodeRating, codeForcesRating);
//   updateHeatmap(dailySubmissions);
// });

//
// Sidebar and Navigation Listeners
//
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
});

//
// --- Chart Update Functions ---
//

// 1. Radial Bar Chart for Problem Distribution
function updateChart(totalSolved, leetcodeSolved, codeforcesSolved) {
  if (totalSolved <= 0) {
    console.error("Invalid totalSolved value:", totalSolved);
    return;
  }

  const targetElement = document.querySelector('#donutChart');
  if (!targetElement) {
    console.error("Target element '#donutChart' not found in DOM.");
    return;
  }

  var optionsDonut = {
    chart: {
      type: 'donut',
      height: 500,
      width: 500,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '40%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Solved',
              fontSize: '15px',
              color: '#E9ECEF',
              formatter: function () {
                return totalSolved;
              },
            },
          },
        },
      },
    },
    // Use actual numbers so ApexCharts will compute the percentage distribution
    series: [
      codeforcesSolved,
      leetcodeSolved,
    ],
    labels: ['CodeForces', 'LeetCode'],
    colors: [
      '#0000FF',  // CodeForces: blue
      '#FF0000'   // LeetCode: red
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        gradientToColors: ['#0000FF', '#FF0000'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    legend: {
      show: true,
      position: 'right',
      offsetX: 90,
      offsetY: 175,
    },
  };

  // Destroy any existing donut chart instance if present
  if (window.chartDonut && typeof window.chartDonut.destroy === "function") {
    console.log("Destroying existing donut chart...");
    window.chartDonut.destroy();
  }

  window.chartDonut = new ApexCharts(targetElement, optionsDonut);
  window.chartDonut.render();
}


// 2. Area Chart for Ratings (LeetCode and CodeForces) with Red and Blue Gradients
function updateAreaChart(leetCodeRating, codeForcesRating) {
  let len = Math.max(leetCodeRating.length, codeForcesRating.length);
  let categories = [];
  for (let i = 1; i <= len; i++) {
    categories.push("Contest " + i);
  }

  var optionsArea = {
    chart: {
      height: 380,
      type: 'area',
      stacked: false,
    },
    stroke: {
      curve: 'straight'
    },
    series: [{
        name: "LeetCode Rating",
        data: leetCodeRating
      },
      {
        name: "CodeForces Rating",
        data: codeForcesRating
      }
    ],
    xaxis: {
      categories: categories,
    },
    tooltip: {
      followCursor: true
    },
    // Set base colors: red for LeetCode and blue for CodeForces.
    colors: ['#FF0000', '#0000FF'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
  };

  if (window.areaChart && typeof window.areaChart.destroy === "function") {
    window.areaChart.destroy();
  }

  window.areaChart = new ApexCharts(document.querySelector("#areachart"), optionsArea);
  window.areaChart.render();
}

// 3. Heatmap Chart for Daily Submissions (Green Gradient remains unchanged)
function updateHeatmap(dailySubmissions) {
  let data = [];
  for (let i = 29; i >= 0; i--) {
    let date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      x: date.toISOString().split('T')[0],
      y: dailySubmissions[29 - i]
    });
  }

  const MIN_VALUE = 0;
  const MAX_VALUE = 40;

  let optionsHeatmap = {
    chart: {
      height: 350,
      type: 'heatmap'
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          min: MIN_VALUE,
          max: MAX_VALUE,
          gradient: {
            shadeIntensity: 0.8,
            inverseColors: false,
            stops: [0, 100],
            colorStops: [
              { offset: 0, color: '#c2f3c2', opacity: 1 }, // light green
              { offset: 100, color: '#006400', opacity: 1 }  // dark green
            ]
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    series: [{
      name: 'Daily Submissions',
      data: data
    }],
    title: {
      text: 'Submissions',
    },
  };

  if (window.heatmapChart && typeof window.heatmapChart.destroy === "function") {
    window.heatmapChart.destroy();
  }

  window.heatmapChart = new ApexCharts(document.querySelector('#heatmapChart'), optionsHeatmap);
  window.heatmapChart.render();
}
