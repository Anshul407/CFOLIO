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
const aggregateRating = 1950;
const overallRanking = "150 / 10,000,000";
const topPercentile = "2.5%";

// Aggregated problem counts
const totalSolved = 550;     // (e.g., LeetCode + Codeforces + Others)
const leetcodeSolved = 335;
const codeforcesSolved = 210;
const otherSolved = 5;

let assignValue=async()=>{
    let cur1 = await fetch(url4);
    let data1 = await cur1.json();
    let cur2=await fetch(url3);
    let data2=await cur2.json();
    const okSubmissions = data2.result.filter(sub => sub.verdict === "OK");
    const cfProblems = new Set(okSubmissions.map(sub => `${sub.problem.contestId}-${sub.problem.index}`));
    const lcProblems=data1.totalSolved;
    document.getElementById("total-solved").textContent=cfProblems.size+lcProblems;
    
    document.getElementById("leetcode-solved").textContent=lcProblems;
    document.getElementById("codeforces-solved").textContent=cfProblems.size
    console.log(cfProblems.size+lcProblems);


}
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
assignValue();// --- Overall Performance Chart ---

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

// Function to get the current week's contest details
function getCurrentWeekContestDetails() {
    const today = new Date();

    // Reference dates for Weekly and Biweekly contests
    const referenceWeeklyDate = new Date("2025-01-19T08:00:00+05:30"); // Weekly Contest 433 (Jan 19, 2025)
    const referenceBiweeklyDate = new Date("2025-01-18T20:00:00+05:30"); // Biweekly Contest 148 (Jan 18, 2025)

    // Calculate the number of full 7-day weeks since the Weekly Contest reference date
    const weeklyDaysDiff = Math.floor((today - referenceWeeklyDate) / (1000 * 60 * 60 * 24));
    const weeklyContestNumber = 433 + Math.floor(weeklyDaysDiff / 7); // Weekly Contest starts from 433 on Jan 19, 2025

    // Calculate the number of full 14-day intervals since the Biweekly Contest reference date
    const biweeklyDaysDiff = Math.floor((today - referenceBiweeklyDate) / (1000 * 60 * 60 * 24));
    const biweeklyContestNumber = 148 + Math.floor(biweeklyDaysDiff / 14); // Biweekly Contest starts from 148 on Jan 18, 2025

    // Adjust for 1-week lag:
    const correctedWeeklyContestNumber = weeklyContestNumber + 1;
    const correctedBiweeklyContestNumber = biweeklyContestNumber + 1;

    // Check if this week has a Biweekly Contest (every 14 days from Jan 18, 2025)
    const isBiweeklyWeek = 1;

    return {
        biweeklyLink: isBiweeklyWeek ? `https://leetcode.com/contest/biweekly-contest-${correctedBiweeklyContestNumber}/` : null,
        weeklyLink: `https://leetcode.com/contest/weekly-contest-${correctedWeeklyContestNumber}/`,
    };
}

// Function to display contest links
function displayContestLinks() {
    const { biweeklyLink, weeklyLink } = getCurrentWeekContestDetails();
    const contestLinksContainer = document.getElementById("contest-links");

    contestLinksContainer.innerHTML = ""; // Clear previous content

    if (biweeklyLink) {
        contestLinksContainer.innerHTML += `
            <p>
                <strong>Biweekly Contest:</strong>
                <a href="${biweeklyLink}" target="_blank">${biweeklyLink}</a>
            </p>
        `;
    }

    contestLinksContainer.innerHTML += `
        <p>
            <strong>Weekly Contest:</strong>
            <a href="${weeklyLink}" target="_blank">${weeklyLink}</a>
        </p>
    `;
}

// Run the function when the DOM loads
document.addEventListener("DOMContentLoaded", displayContestLinks);
