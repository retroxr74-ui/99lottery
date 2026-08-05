// storage.js

const Storage = {

    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }

};

// Save current user
function saveCurrentUser(user) {
    Storage.save("demoUser", user);
}

// Get current user
function getCurrentUser() {
    return Storage.get("demoUser");
}

// Check login status
function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

// Login
function login() {
    localStorage.setItem("loggedIn", "true");
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

// Save app settings
function saveSettings(settings) {
    Storage.save("appSettings", settings);
}

// Get app settings
function getSettings() {
    return Storage.get("appSettings");
}
