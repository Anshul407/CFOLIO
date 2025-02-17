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

let easy = 100, medium = 200, hard = 50;

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
    var total = easy + medium + hard;
    
    // Avoid division by zero. If total is 0, set all values to 0.
    if (total === 0) {
      easy = medium = hard = 0;
    } else {
      easy = Number(((easy / total) * 100).toFixed(2));
      medium = Number(((medium / total) * 100).toFixed(2));
      hard = Number(((hard / total) * 100).toFixed(2));
    }
    
    // Check if container element exists
    var chartContainer = document.querySelector('#radialBarBottom');
    if (!chartContainer) {
      console.error("Element with id 'radialBarBottom' not found!");
      return;
    }
    
    // If a chart already exists, destroy it to avoid multiple instances
    if (window.chartCircle4 && typeof window.chartCircle4.destroy === 'function') {
      window.chartCircle4.destroy();
    }
    
    var optionsCircle4 = {
      chart: {
        type: 'radialBar',
        height: 430,
        width: 480,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      // Retain your original base colors
      colors: ['#ce1515', '#d07400', '#009292'],
      // Apply gradient fill for a brighter effect
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.6,
          // Brighter ending colors for each series:
          gradientToColors: ['#ff6a6a', '#ffb84d', '#40dada'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      plotOptions: {
        radialBar: {
          size: undefined,
          inverseOrder: true,
          hollow: {
            margin: 5,
            size: '48%',
            background: 'transparent',
          },
          track: {
            show: false,
          },
          startAngle: -180,
          endAngle: 180,
          dataLabels: {
            name: {
              color: '#fff',
              fontSize: '20px'
            },
            value: {
              color: '#fff',
              fontSize: '20px'
            },
            total: {
              show: true,
              label: 'Total',
              color: '#fff',
              fontSize: '20px',
              formatter: function (w) {
                return total;
              }
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      // Note: series order and labels are set to show Hard, Medium, then Easy
      series: [hard, medium, easy],
      labels: ['Hard', 'Medium', 'Easy'],
      legend: {
        show: true,
        floating: true,
        position: 'right',
        offsetX: 70,
        offsetY: 300,
        labels: {
          colors: '#fff'
        }
      },
    };
    
    // Render the Radial Bar chart and store the instance globally
    window.chartCircle4 = new ApexCharts(chartContainer, optionsCircle4);
    window.chartCircle4.render();
  }
  
  
  

/**
 * Renders the line chart using ApexCharts with your ratings data and dark theme.
 */
function renderLineChart(ratings) {
    var chartOptions = {
      chart: {
        type: 'line',
        height: 430,
        background: "transparent",       // Transparent background
        foreColor: "#FFFFFF",            // White text for contrast
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900
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
  
