//code here:

const moodButtons = document.querySelectorAll(".mood-btn");
const moodNotes = document.getElementById("mood-notes");
const saveMoodButton = document.getElementById("save-mood");
const moodHistory = document.getElementById("mood-history");
const moodChartCanvas = document.getElementById("moodChart");

let selectedMood = "";
let moodData = JSON.parse(localStorage.getItem("moodData")) || [];

//handle mood selection
moodButtons.forEach(button =>{
    button.addEventListener("click", ()=>{
        selectedMood = button.getAttribute('data-mood');
        moodButtons.forEach(btn => btn.style.opacity = "0.5");
        button.style.opacity = '1'; //highlight selected mood
    });
});

//save mood entry
saveMoodButton.addEventListener("click", ()=>{
    if (!selectedMood){
        alert("please select a mood");
        return;
    }

    const moodEntry = {
        mood: selectedMood,
        note: moodNotes.value.trim(),
        date: new Date().toLocaleDateString(),
    };

    moodData.push(moodEntry);
    localStorage.setItem("moodDate", JSON.stringify(moodData));

    moodNotes.value = "";
    selectedMood = "";
    moodButtons.forEach(btn => btn.style.opacity = "0.5");

    renderMoodHistory();
    updateMoodChart();

});

//render mood history
function renderMoodHistory(){
    moodHistory.innerHTML = "";

    moodData.forEach(entry =>{
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${entry.date}</strong>: ${getMoodEmoji(entry.mood)} - ${entry.note}`;
        moodHistory.appendChild(listItem);
    });

}

//convert mood text to emoji
function getMoodEmoji(mood){
    const moodMap = {
        happy: "😀",
        neutral: "😶",
        sad: "😔",
        angry: "😡",
    };
    return moodMap[mood] || "?";
}

//initialise chart.js
let moodChart;
function updateMoodChart(){
    const moodCounts = {happy: 0, neutral: 0, sad: 0, angry: 0};

    moodData.forEach(entry =>{
        moodCounts[entry.mood]++;
    });

    const chartData = {
        labels: ["happy 😀", "neutral 😶", "sad 😔", "angry 😡"],
        datasets: [{
            label: "mood frequency",
            data: Object.values(moodCounts),
            backgroundColor: ["#28a745", "#ffc107", "#007bff", "#dc3545"]
        }]
    };

    if (moodChart){
        moodChart.destroy(); //prevent duplicate charts
    }

    moodChart =  new Chart(moodChartCanvas, {
        type: "bar",
        data: chartData
    });
}

//load existing data 
document.addEventListener("DOMContentLoaded", ()=>{
    renderMoodHistory();
    updateMoodChart();
})