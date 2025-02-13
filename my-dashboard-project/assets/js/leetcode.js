// Fetch LeetCode user data using GraphQL API
const fetchLeetCodeData = async (username) => {
    const query = `
        query getUserData($username: String!) {
            matchedUser(username: $username) {
                username
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage
            }
            userContestRankingHistory(username: $username) {
                contest {
                    title
                    startTime
                }
                rating
                ranking
                attended
            }
        }
    `;

    const variables = { username };

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        updateUI(data.data); // Update UI with fetched data
    } catch (error) {
        console.error("Error fetching LeetCode data:", error);
    }
};

// Function to update UI with fetched data
const updateUI = (data) => {
    if (!data || !data.matchedUser) {
        console.error("User data not found");
        return;
    }

    // Problem Solving Stats
    const submissionStats = data.matchedUser.submitStats.acSubmissionNum;
    let easy = 0, medium = 0, hard = 0, totalSolved = 0;
    
    submissionStats.forEach(stat => {
        if (stat.difficulty === "Easy") easy = stat.count;
        if (stat.difficulty === "Medium") medium = stat.count;
        if (stat.difficulty === "Hard") hard = stat.count;
        totalSolved += stat.count;
    });

    document.getElementById("total-questions").textContent = totalSolved;
    document.getElementById("easy-count").textContent = easy;
    document.getElementById("medium-count").textContent = medium;
    document.getElementById("hard-count").textContent = hard;

    // Update Donut Chart
    updateDonutChart(easy, medium, hard);

    // Contest Stats
    if (data.userContestRanking) {
        document.getElementById("contest-rating").textContent = Math.round(data.userContestRanking.rating);
        document.getElementById("global-rank").textContent = data.userContestRanking.globalRanking;
        document.getElementById("top-percent").textContent = data.userContestRanking.topPercentage + "%";
    }

    // Extract ratings from contest participation history
    const contestHistory = data.userContestRankingHistory || [];
    let ratings = contestHistory.map(contest => contest.rating);

    // Draw line graph with contest ratings
    drawLineGraph(ratings);
};

// Function to update Donut Chart (Difficulty Distribution)
function updateDonutChart(easy, medium, hard) {
    const totalSolved = easy + medium + hard;

    // Update center text and legend
    document.getElementById("donut-total").textContent = `${totalSolved}`;
    document.getElementById("donut-subtitle").textContent = "Solved";

    document.getElementById("easy-legend-count").textContent = `${easy}`;
    document.getElementById("medium-legend-count").textContent = `${medium}`;
    document.getElementById("hard-legend-count").textContent = `${hard}`;

    // Calculate arc lengths based on distribution
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

        // Position subsequent arcs so that they appear consecutively
        mediumArc.style.strokeDashoffset = `-${easyArcLen}`;
        hardArc.style.strokeDashoffset = `-${(easyArcLen + mediumArcLen)}`;
    }
}

// Fetch username from LeetCode profile and trigger fetch
let userHandleElement = document.querySelector(".user-handle");
if (userHandleElement) {
    let username = userHandleElement.innerText.trim();
    fetchLeetCodeData(username);

    let profileLink = document.getElementById("leetcode-profile-link");
    if (profileLink) {
        profileLink.href = `https://leetcode.com/u/${username}/`;
        profileLink.textContent = username;
    }
}
