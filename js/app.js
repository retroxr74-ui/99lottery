window.onload = function () {

    const user = JSON.parse(localStorage.getItem("demoUser"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const nameElement = document.getElementById("username");

    if (nameElement) {
        nameElement.innerHTML = user.name;
    }

};
