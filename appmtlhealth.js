let selectedMood = null;

const moodButtons = document.querySelectorAll(".moods button");
const submitBtn = document.getElementById("submit");
const feedback = document.getElementById("feedback");
const historyDiv = document.getElementById("history");

moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMood = Number(btn.dataset.mood);
    moodButtons.forEach(b => b.style.opacity = "0.4");
    btn.style.opacity = "1";
  });
});

submitBtn.addEventListener("click", () => {
  if (!selectedMood) {
    alert("Pick a mood first");
    return;
  }

  const entry = {
    mood: selectedMood,
    note: document.getElementById("note").value,
    date: new Date().toISOString()
  };

  const data = JSON.parse(localStorage.getItem("checkins") || "[]");
  data.push(entry);
  localStorage.setItem("checkins", JSON.stringify(data));

  showFeedback(data);
  showHistory(data);

  selectedMood = null;
  document.getElementById("note").value = "";
  moodButtons.forEach(b => b.style.opacity = "1");
});

function showFeedback(data) {
  const lastWeek = data.slice(-5);
  const avgMood =
    lastWeek.reduce((sum, e) => sum + e.mood, 0) / lastWeek.length;

  if (avgMood <= 2) {
    feedback.textContent =
      "You've been having a rough time lately. It might help to talk to someone you trust.";
  } else if (avgMood <= 3) {
    feedback.textContent =
      "You're doing okay, but don't forget to rest and take breaks.";
  } else {
    feedback.textContent =
      "You're doing pretty well! Keep checking in with yourself.";
  }
}

function showHistory(data) {
  historyDiv.innerHTML =
    "<strong>Recent check-ins:</strong><br>" +
    data
      .slice(-5)
      .map(
        e =>
          `${new Date(e.date).toLocaleDateString()} — Mood: ${e.mood}`
      )
      .join("<br>");
}

showHistory(JSON.parse(localStorage.getItem("checkins") || "[]"));
