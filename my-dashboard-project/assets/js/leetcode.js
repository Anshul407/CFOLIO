// Build API endpoints based on the user handle
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

let easy = 0, medium = 0, hard = 0;

// Fetch problem stats from API and update donut chart
async function assignValue() {
    try {
        let cur = await fetch(url);
        let data = await cur.json();

        document.getElementById("total-questions").textContent = data.totalSolved;
        document.getElementById("easy-count").textContent = data.easySolved;
        document.getElementById("medium-count").textContent = data.mediumSolved;
        document.getElementById("hard-count").textContent = data.hardSolved;

        easy = data.easySolved;
        medium = data.mediumSolved;
        hard = data.hardSolved;

        updateDonutChart(easy, medium, hard);
    } catch (err) {
        console.error("Error fetching problem stats:", err);
    }
}

// Set the LeetCode profile link using the user handle
let userHandleElement = document.querySelector(".user-handle");
if (userHandleElement) {
    let actualUsername = userHandleElement.innerText.trim();
    let profileLink = document.getElementById("leetcode-profile-link");
    if (profileLink) {
        profileLink.href = `https://leetcode.com/u/${actualUsername}/`;
        profileLink.textContent = actualUsername;
    }
}

// Fetch contest stats from API, extract ratings, and render line chart
async function fetchContest() {
    try {
        let cur = await fetch(url2);
        let data = await cur.json();
        console.log(cur);

        document.getElementById("contest-rating").textContent = Math.round(data.contestRating);
        document.getElementById("global-rank").textContent = data.contestGlobalRanking;
        document.getElementById("top-percent").textContent = data.contestTopPercentage + "%";

        // Extract ratings from contestParticipation array
        let ratings = data.contestParticipation.map(contest => Math.round(contest.rating));
        if (ratings.length > 30) {
            ratings = ratings.slice(-30);
        }
        renderLineChart(ratings);
    } catch (err) {
        console.error("Error fetching contest stats:", err);
    }
}

// Initiate data fetches
assignValue();
fetchContest();

/**
 * Updates the donut chart based on the counts for Easy, Medium, and Hard.
 * On hover over a segment, updates the center text to show the percentage (to two decimals)
 * and the segment label.
 */
function updateDonutChart(easy, medium, hard) {
    const totalSolved = easy + medium + hard;
    document.getElementById("donut-total").textContent = `${totalSolved}`;
    document.getElementById("donut-subtitle").textContent = "Solved";

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

        // Position arcs consecutively
        mediumArc.style.strokeDashoffset = `-${easyArcLen}`;
        hardArc.style.strokeDashoffset = `-${(easyArcLen + mediumArcLen)}`;

        // Store values for tooltip and hover center text
        easyArc.dataset.count = easy;
        easyArc.dataset.label = "Easy";
        mediumArc.dataset.count = medium;
        mediumArc.dataset.label = "Medium";
        hardArc.dataset.count = hard;
        hardArc.dataset.label = "Hard";

        // Attach hover listeners to update center text with two decimal precision
        [easyArc, mediumArc, hardArc].forEach(segment => {
            if (!segment.hasCenterTextListener) {
                segment.addEventListener("mousemove", function(e) {
                    const count = parseInt(this.dataset.count);
                    const label = this.dataset.label;
                    const percent = totalSolved === 0 ? 0 : ((count / totalSolved) * 100).toFixed(2);
                    document.getElementById("donut-total").textContent = percent + "%";
                    document.getElementById("donut-subtitle").textContent = label;
                });
                segment.addEventListener("mouseout", function() {
                    document.getElementById("donut-total").textContent = totalSolved;
                    document.getElementById("donut-subtitle").textContent = "Solved";
                });
                segment.hasCenterTextListener = true;
            }
        });
    }
}

/**
 * Renders the line chart using ApexCharts with your ratings data and dark theme.
 */
function renderLineChart(ratings) {
    var chartOptions = {
      chart: {
        type: 'line',
        height: 400,
        background: "transparent",       // Transparent background
        foreColor: "#FFFFFF",            // White text for contrast
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      colors: ["#F89C2C"], // Classic LeetCode orange for the line
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [
        {
          name: 'Rating',
          data: ratings
        }
      ],
      markers: {
        size: 6,
        colors: ["#F89C2C"],        // Use accent color for markers
        strokeColors: "#FFFFFF",     // White border for markers
        strokeWidth: 2,
        hover: {
          size: 9
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(val) {
            return val.toFixed(2);
          }
        }
      },
      grid: {
        borderColor: '#444444'
      },
      xaxis: {
        categories: ratings.map((_, i) => i + 1),
        labels: {
          style: {
            colors: "#FFFFFF"
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -10,
        labels: {
          colors: '#FFFFFF'
        }
      }
    };
  
    var lineChart = new ApexCharts(document.querySelector('#contestLineChart'), chartOptions);
    lineChart.render();
  }
  
