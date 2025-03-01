// overall.js
let useridElement = document.getElementsByClassName('user-handlecf');
let useridElement2 = document.getElementsByClassName('user-handlelc');
let url = 'https://codeforces.com/api/user.info?handles=anshul407&checkHistoricHandles=false';
let url2='https://codeforces.com/api/user.rating?handle=anshul407';
let url3='https://codeforces.com/api/user.status?handle=anshul407';
let url4 = 'https://leetcode-api-faisalshohag.vercel.app/';
let url5 = 'https://alfa-leetcode-api.onrender.com//contest';
let url6='https://codeforces.com/api/contest.list';
let cfcontesturl='https://competeapi.vercel.app/contests/upcoming/';
if (useridElement2.length > 0) {
    let userid = useridElement2[0].innerText.trim();
    url4 = url4 + userid;
    url5 = `https://alfa-leetcode-api.onrender.com/${userid}/contest`;
    console.log(url);
}

if (useridElement.length > 0) {
  let userid = useridElement[0].innerText.trim(); 
  
  url = `https://codeforces.com/api/user.info?handles=${userid}&checkHistoricHandles=false`;
  url2= `https://codeforces.com/api/user.rating?handle=${userid}`;
  url3=`https://codeforces.com/api/user.status?handle=${userid}`;
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

let dailySubmissions = {};
//heatmap call
generateAndUpdateHeatmap(18, 500, 300);

// --- New Ratings Data for the Area Chart ---
let leetCodeRating = [];      // Sample data for LeetCode Rating
let codeForcesRating = [];     // Sample data for CodeForces Rating
let assignValue=async()=>{
  let cur1 = await fetch(url4);
  let data1 = await cur1.json();
  let cur2=await fetch(url3);
  let data2=await cur2.json();
  const okSubmissions = data2.result.filter(sub => sub.verdict === "OK");
  const cfProblems = new Set(okSubmissions.map(sub => `${sub.problem.contestId}-${sub.problem.index}`));
  const lcProblems=data1.totalSolved;
  totalSolved=cfProblems.size+lcProblems;
  console.log(totalSolved)
  
  leetcodeSolved=lcProblems;
  codeforcesSolved=cfProblems.size;
  document.getElementById("total-solved").textContent = totalSolved;
  document.getElementById("leetcode-solved").textContent = leetcodeSolved;
  document.getElementById("codeforces-solved").textContent = codeforcesSolved;
  document.getElementById("other-solved").textContent = otherSolved;
  updateChart(totalSolved, leetcodeSolved, codeforcesSolved, otherSolved);
  updateHeatmap(dailySubmissions);
  fetchContest();
  // Update charts
  getDailySubmissions(useridElement[0].innerText.trim());
  assignContest();
  
}
async function getDailySubmissions(handle) {
  try {
      const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
      const data = await response.json();

      if (data.status !== "OK") {
          console.error("Error fetching data:", data.comment);
          return;
      }

      const submissions = data.result;
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const fourMonthsAgo = now - 4 * 30 * 24 * 60 * 60; // Approx 4 months ago in seconds

      

      submissions.forEach(submission => {
          if (submission.creationTimeSeconds >= fourMonthsAgo) {
              const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0]; // YYYY-MM-DD
              dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
          }
      });
      console.log(dailySubmissions);

       // Output result
  } catch (error) {
      console.error("Error fetching submissions:", error);
  }
}

// Example usage:
 // Replace with any Codeforces handle

let fetchContest = async () => {
  // Fetch contest data
  let cur = await fetch(cfcontesturl);
  let data = await cur.json();

  const contestList = document.getElementById("contestList");

  // Loop through each contest and add to the list
  data.forEach(contest => {
      let li = document.createElement("li");
      
      // Create the link element with contest name
      let contestLink = document.createElement("a");
      contestLink.href = contest.url;
      contestLink.textContent = contest.title; // Contest name
      
      // Add the contest name link to the list item
      li.appendChild(contestLink);
      
      // Add the site name next to the link
      let siteSpan = document.createElement("span");
      siteSpan.textContent = ` (${contest.site})`; // Site name
      li.appendChild(siteSpan);
      
      // Append the list item to the contest list
      contestList.appendChild(li);
  });

  // Optionally log the beforeContests array (if needed)
  console.log(beforeContests);  // Ensure beforeContests is defined or passed properly if required
};




let upcommingContest=async()=>{
    let cur1 = await fetch(url6);
    let data1 = await cur1.json();
    const upcomingContests = data1.result.filter(contest => contest.phase === "BEFORE");
    upcomingContests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    console.log(upcomingContests);
    const contestsHtml = upcomingContests
        .map(
            (contest) => `
                <div class="contest">
                    <h3>${contest.name}</h3>
                    <p><strong>Start Time:</strong> ${new Date(contest.startTimeSeconds * 1000).toLocaleString()}</p>
                    <p><strong>Duration:</strong> ${contest.durationSeconds / 3600} hours</p>
                </div>
            `
        )
        .join("");
    // Render contests in the container
    document.getElementById("contest-container").innerHTML=contestsHtml;
    
    
}
upcommingContest();
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
 
  updateAreaChart(leetCodeRating, codeForcesRating);


}
assignValue();
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

  var options = {
    series: [codeforcesSolved, leetcodeSolved], // CodeForces first, LeetCode second
    labels: ['CodeForces', 'LeetCode'],
    colors: ['blue', 'red'], // CodeForces -> Blue, LeetCode -> Red
    chart: {
      type: 'donut',
      width: 550, // Reduced width to make the chart smaller
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%', // Adjusts the donut thickness
          labels: {
            show: true,
            total: {
              show: true,
              color: 'white',
              label: 'Total',
              size: 300,
              formatter: function() {
                return totalSolved;
              }
            }
          }
        }
      }
    },
    fill: {
      type: 'solid',
      opacity: 1, // Ensure the slices remain solid
    },
    states: {
      hover: {
        filter: {
          type: 'none', // Prevents unwanted background color on hover
        }
      }
    },
    stroke: {
      show: true,
      width: 0, // Removes the track (white background)
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 480 // Further reduce size on small screens
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Destroy any existing donut chart instance if present
  if (window.chartDonut && typeof window.chartDonut.destroy === "function") {
    console.log("Destroying existing donut chart...");
    window.chartDonut.destroy();
  }

  window.chartDonut = new ApexCharts(targetElement, options);
  window.chartDonut.render();
}






// 2. Area Chart for Ratings (LeetCode and CodeForces) with Red and Blue Gradients
function updateAreaChart(leetCodeRating, codeForcesRating) {
  let len = Math.max(leetCodeRating.length, codeForcesRating.length);
  let categories = [];
  for (let i = 1; i <= len; i++) {
    categories.push("Contest " + i);
  }

  let leetCodeVisible = true;
  let codeForcesVisible = true;

  let chartOptions = {
    chart: {
      height: 380,
      type: 'area',
      stacked: false,
    },
    stroke: {
      curve: 'straight'
    },
    series: [
      {
        name: "LeetCode",
        data: leetCodeRating
      },
      {
        name: "CodeForces",
        data: codeForcesRating
      }
    ],
    xaxis: {
      categories: categories,
    },
    tooltip: {
      followCursor: true
    },
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
    legend: {
      show: false // Hide default legend
    }
  };

  if (window.areaChart && typeof window.areaChart.destroy === "function") {
    window.areaChart.destroy();
  }

  window.areaChart = new ApexCharts(document.querySelector("#areachart"), chartOptions);
  window.areaChart.render();

  // Add Custom Legend Buttons
  let legendContainer = document.getElementById("custom-legend");
  legendContainer.innerHTML = `
    <button id="leetCodeLegend" class="legend-btn active" style="background-color: #FF0000;">LeetCode</button>
    <button id="codeForcesLegend" class="legend-btn active" style="background-color: #0000FF;">CodeForces</button>
  `;

  document.getElementById("leetCodeLegend").addEventListener("click", function () {
    leetCodeVisible = !leetCodeVisible;
    toggleSeries();
    this.classList.toggle("active", leetCodeVisible);
  });

  document.getElementById("codeForcesLegend").addEventListener("click", function () {
    codeForcesVisible = !codeForcesVisible;
    toggleSeries();
    this.classList.toggle("active", codeForcesVisible);
  });

  function toggleSeries() {
    let seriesData = [];
    let colors = [];

    if (leetCodeVisible) {
        seriesData.push({
            name: "LeetCode",
            data: leetCodeRating
        });
        colors.push("#FF0000"); // Red for LeetCode
    }

    if (codeForcesVisible) {
        seriesData.push({
            name: "CodeForces",
            data: codeForcesRating
        });
        colors.push("#0000FF"); // Blue for CodeForces
    }

    window.areaChart.updateOptions({
        series: seriesData,
        colors: colors
    });
  }
}
// 3. Heatmap for total submission
function generateAndUpdateHeatmap(count, totalSubmissions, acceptedSubmissions) {
  // Generate data for each matrix series (each representing a count on that day)
  function generateData(count, totalSubmissions, acceptedSubmissions, matrixIndex) {
    let data = [];
    let submissionRatio = acceptedSubmissions / totalSubmissions;
    let startDate = new Date();

    for (let i = 0; i < count; i++) {
      let randomValue = Math.floor(Math.random() * 91); // Random value between 0 and 90
      // Adjust value based on submission ratio with slight variation per matrix
      let adjustedValue = Math.floor(randomValue * submissionRatio) + matrixIndex * 5;
      
      // Create a date by adding i days to the start date
      let date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      let formattedDate = date.toISOString().split("T")[0];

      data.push({
        x: formattedDate, // Date category on x-axis
        y: adjustedValue  // Count value for that day
      });
    }
    return data;
  }

  const matricesCount = 5; // e.g., Matrix1, Matrix2, etc.
  // Create series without a "name" so the y-axis won't display matrix labels
  const series = Array.from({ length: matricesCount }, (_, index) => ({
    name: "",
    data: generateData(count, totalSubmissions, acceptedSubmissions, index)
  }));

  var options = {
    series: series,
    chart: {
      height: 400,
      type: 'heatmap',
      // Lighter background instead of dark
      background: '#ffffff',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
      dropShadow: { 
        enabled: true,
        color: '#000',
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.1  // Subtle shadow so cells pop on a light background
      }
    },
    // Enable data labels to show the count value in each cell
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val;
      },
      style: {
        // Dark text on light background
        colors: ['#333']
      }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.8,
        radius: 0, // Square cells
        useFillColorAsStroke: true,
        colorScale: {
          // LeetCode-style green color scale (dark-to-bright green)
          ranges: [
            { from: 0,  to: 20,  color: "#0e4429" },
            { from: 21, to: 40,  color: "#006d32" },
            { from: 41, to: 60,  color: "#26a641" },
            { from: 61, to: 80,  color: "#39d353" },
            { from: 81, to: 100, color: "#9be9a8" }
          ]
        }
      }
    },
    xaxis: {
      type: 'datetime',  // x-axis displays dates
      labels: { style: { colors: "#333", fontSize: "12px", fontWeight: 600 } }
    },
    // Hide y-axis labels since we want to display count values inside the cells
    yaxis: {
      labels: { show: false }
    },
    title: {
      text: `Contest Performance Heatmap (Total: ${totalSubmissions}, Accepted: ${acceptedSubmissions})`,
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#333' }
    },
    tooltip: {
      enabled: true,
      theme: "light" // Matches the lighter background
    }
  };

  // Destroy existing chart instance if present before rendering a new one
  if (window.heatmapChart && typeof window.heatmapChart.destroy === "function") {
    window.heatmapChart.destroy();
  }

  window.heatmapChart = new ApexCharts(document.querySelector("#heatmapChart"), options);
  window.heatmapChart.render();
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

