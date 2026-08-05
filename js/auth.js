// Register User
function registerUser(name, email, username, password) {

    const user = {
        name: name,
        email: email,
        username: username,
        password: password
    };

    localStorage.setItem("demoUser", JSON.stringify(user));
}

// Login User
function loginUser(username, password) {

    const user = JSON.parse(localStorage.getItem("demoUser"));

    if (!user) {
        alert("Please register first.");
        return false;
    }

    if (user.username === username && user.password === password) {
        localStorage.setItem("loggedIn", "true");
        return true;
    }

    alert("Invalid username or password.");
    return false;
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}
