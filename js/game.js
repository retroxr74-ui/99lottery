// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome");

  const user = JSON.parse(localStorage.getItem("demoUser"));

  if (welcome && user) {
    welcome.textContent = `Welcome, ${user.name}!`;
  }

  const today = document.getElementById("todayDate");
  if (today) {
    today.textContent = new Date().toLocaleDateString();
  }
});

function showMessage(text) {
  alert(text);
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
