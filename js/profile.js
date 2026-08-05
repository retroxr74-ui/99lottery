window.onload = function () {

    const user = JSON.parse(localStorage.getItem("demoUser"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("name").innerHTML = user.name;
    document.getElementById("email").innerHTML = "Email: " + user.email;
    document.getElementById("username").innerHTML = "Username: " + user.username;

};

function editProfile() {

    const user = JSON.parse(localStorage.getItem("demoUser"));

    const newName = prompt("Enter new name", user.name);

    if (newName) {
        user.name = newName;
        localStorage.setItem("demoUser", JSON.stringify(user));
        location.reload();
    }

}
