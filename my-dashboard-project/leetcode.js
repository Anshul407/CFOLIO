let url = 'https://leetcode-api-faisalshohag.vercel.app/';
let useridElement = document.getElementsByClassName('user-handle');
let imgContainer = document.querySelector('#anshul');
let url2 = 'https://leetcard.jacoblin.cool/?theme=chartreuse&font=BenchNine&ext=contest';
if (useridElement.length > 0) {
    let userid = useridElement[0].innerText.trim(); 
    url = url + userid;
    url2 = `https://leetcard.jacoblin.cool/${userid}?theme=chartreuse&font=BenchNine&ext=contest`;
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

let fetchCard=async()=>{
    let x = await fetch(url2); 
    console.log(url2);
    let svgContent = await x.text();
    console.log(svgContent);
    imgContainer.innerHTML = svgContent;
}

assignValue();
fetchCard();

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
