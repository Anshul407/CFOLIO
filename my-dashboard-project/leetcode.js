let url = 'https://leetcode-api-faisalshohag.vercel.app/';
let useridElement = document.getElementsByClassName('user-handle');
let contestarray = document.querySelector('#anshul');
let url2 = 'https://alfa-leetcode-api.onrender.com//contest';
if (useridElement.length > 0) {
    let userid = useridElement[0].innerText.trim(); 
    url = url + userid;
    url2 = `https://alfa-leetcode-api.onrender.com/${userid}/contest`;
    console.log(url);
}

const contestRating = 1584;
const globalRank = "168,092 / 6,668,586";
const topPercent = "25.16%";

let easy = 0;
let medium = 0;
let hard = 0;

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

    drawChart();  // Now call the chart function **after** updating values
};

let fetchContest=async()=>{
  let cur = await fetch(url2);
  let data = await cur.json();
  console.log(cur);
  document.getElementById("contest-rating").textContent=data.contestRating;
  document.getElementById("global-rank").textContent=data.contestGlobalRanking;
  document.getElementById("top-percent").textContent=data.contestTopPercentage;

  let ratings = data.contestParticipation.map(contest => contest.rating);
  contestarray.textContent=ratings;
}

assignValue();
fetchContest();

// Function to draw the chart
const drawChart = () => {
    const canvas = document.getElementById("difficultyChart");
    const ctx = canvas.getContext("2d");

    const data = [easy, medium, hard];  // Now these values are updated!
    const labels = ["Easy", "Medium", "Hard"];
    const colors = ["#4CAF50", "#FFC107", "#F44336"];

    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const barWidth = 50;
    const barSpacing = 40;
    const maxDataValue = Math.max(...data) || 1; // Avoid division by 0
    const scaleFactor = (chartHeight - 50) / maxDataValue;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear old chart

    let xPos = 50;
    ctx.textAlign = "center";
    ctx.font = "14px sans-serif";

    for (let i = 0; i < data.length; i++) {
        const barHeight = data[i] * scaleFactor;
        ctx.fillStyle = colors[i];
        ctx.fillRect(xPos, chartHeight - barHeight - 30, barWidth, barHeight);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(data[i], xPos + barWidth / 2, chartHeight - barHeight - 35);
        ctx.fillText(labels[i], xPos + barWidth / 2, chartHeight - 10);

        xPos += barWidth + barSpacing;
    }
};

// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
});
