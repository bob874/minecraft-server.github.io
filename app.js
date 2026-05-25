/* =========================
   THE HYENAS - MASTER SYSTEM
   Users + Owner + Economy + SAPS + Shop + Leaderboard + Server Status
   (GitHub Pages safe - localStorage only)
   ========================= */


/* =========================
   USER DATABASE
   ========================= */
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


/* =========================
   OWNER INIT (fallback system)
   ========================= */
function initOwnerAccount() {
    let users = getUsers();

    let ownerExists = users.find(u => u.email === "example@gmail.com");

    if (!ownerExists) {
        users.push({
            username: "owner",
            email: "example@gmail.com",
            password: "amazing1932",
            balance: 1,000,000,000,
            season: 1,
            avatar: null
        });

        saveUsers(users);
    }
}

initOwnerAccount();


/* =========================
   REGISTER
   ========================= */
function register() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = getUsers();

    if (users.find(u => u.email === email)) {
        alert("User already exists!");
        return;
    }

    users.push({
        username,
        email,
        password,
        balance: 10000,
        season: 1,
        avatar: null
    });

    saveUsers(users);

    alert("Account created!");
    window.location.href = "login.html";
}


/* =========================
   LOGIN (UNIFIED SYSTEM)
   ========================= */
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = getUsers();

    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid login!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
}


/* =========================
   CURRENT USER HANDLING
   ========================= */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function updateCurrentUser(updatedUser) {
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    let users = getUsers();
    let index = users.findIndex(u => u.email === updatedUser.email);

    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
}


/* =========================
   PROTECTION
   ========================= */
function protectDashboard() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}


/* =========================
   ECONOMY SYSTEM
   ========================= */
function addBalance(amount) {
    let user = getCurrentUser();
    user.balance += amount;
    updateCurrentUser(user);
}


/* JOIN SERVER REWARD */
function joinReward() {
    addBalance(500);
    alert("+£500 added!");
    location.reload();
}


/* BUY SYSTEM */
function buyPlan(cost) {
    let user = getCurrentUser();

    if (user.balance < cost) {
        alert("Not enough funds!");
        return;
    }

    user.balance -= cost;
    updateCurrentUser(user);

    alert("Purchase successful!");
    location.reload();
}


/* =========================
   RANK SYSTEM
   ========================= */
function getRank(balance) {
    if (balance < 100000) return "Rookie";
    if (balance < 1000000) return "Builder";
    if (balance < 10000000) return "Tycoon";
    return "Hyenas Legend ";
}


/* =========================
   SAPS - STEVE AVATAR SYSTEM
   ========================= */
function generateAvatar(username) {
    let seed = username.length * 999;

    let colors = ["#8B5A2B", "#A0522D", "#CD853F", "#D2691E", "#F4A460"];
    let hats = ["", "", "", "", ""];

    return {
        skin: colors[seed % colors.length],
        hat: hats[seed % hats.length]
    };
}

function getAvatar(user) {
    if (!user.avatar) {
        user.avatar = generateAvatar(user.username);
        updateCurrentUser(user);
    }
    return user.avatar;
}


/* =========================
   DASHBOARD LOADER
   ========================= */
function loadDashboard() {
    protectDashboard();

    let user = getCurrentUser();

    document.getElementById("user").innerText = user.username;
    document.getElementById("money").innerText = user.balance;
    document.getElementById("season").innerText = user.season;
    document.getElementById("rank").innerText = getRank(user.balance);

    /* SAPS */
    let avatar = getAvatar(user);

    if (document.getElementById("avatar-box")) {
        document.getElementById("avatar-box").innerHTML = `
            <div style="font-size:70px;"></div>
            <p>Skin: <span style="color:${avatar.skin};">${avatar.skin}</span></p>
            <p>Hat: ${avatar.hat}</p>
        `;
    }
}


/* =========================
   LEADERBOARD
   ========================= */
function loadLeaderboard() {
    let users = getUsers();

    users.sort((a, b) => b.balance - a.balance);

    let html = "";

    users.forEach((u, i) => {
        html += `<p>#${i + 1} ${u.username} - £${u.balance}</p>`;
    });

    document.getElementById("leaderboard").innerHTML = html;
}


/* =========================
   MINECRAFT SERVER STATUS
   ========================= */
function loadServerStatus() {
    let status = Math.random() > 0.3 ? "ONLINE " : "OFFLINE ";
    document.getElementById("server-status").innerText = status;
}
