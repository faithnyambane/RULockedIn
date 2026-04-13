
// ── Signup ────────────────────────────────────────────────────────────────────
async function submitSignup() {
    const name     = document.getElementById('newUserName').value.trim();
    const email    = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword1').value;
    const confirm  = document.getElementById('newUserPassword2').value;
    const errEl    = document.getElementById('errorMessage');

    errEl.innerText = '';

    if (!name) { errEl.innerText = 'Username cannot be empty.'; return; }
    if (!email) { errEl.innerText = 'Email cannot be empty.'; return; }
    if (!password) { errEl.innerText = 'Password cannot be empty.'; return; }
    if (password.length < 8) { errEl.innerText = 'Password must be at least 8 characters.'; return; }
    if (password !== confirm) { errEl.innerText = 'Passwords do not match.'; return; }

    try {
        const res  = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword: confirm })
        });
        const data = await res.json();

        if (data.success) {
            window.location.href = '/';
        } else {
            errEl.innerText = data.message || 'Signup failed. Please try again.';
        }
    } catch (err) {
        errEl.innerText = 'Could not connect to server.';
    }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function submitLogin() {
    const email    = document.getElementById('existingUserEmail').value.trim();
    const password = document.getElementById('existingUserPassword').value;
    const errEl    = document.getElementById('errorMessage');

    errEl.innerText = '';

    if (!email)    { errEl.innerText = 'Email is required.';    return; }
    if (!password) { errEl.innerText = 'Password is required.'; return; }

    try {
        const res  = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            window.location.href = '/';
        } else {
            errEl.innerText = data.message || 'Login failed. Please try again.';
        }
    } catch (err) {
        errEl.innerText = 'Could not connect to server.';
    }
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/logIn.html';
}
//--Submit Chat-------------------------------------------------------
async function submitPrompt() {
     console.log("Button clicked!");
     const promptInput = document.getElementById('prompt');
     const prompt = document.getElementById('prompt').value;
     promptInput.value = "";
     console.log(prompt);
     const objectResponse = await fetch('/api/chat', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({message: prompt })});
     const response = await objectResponse.json();
     console.log("chat response:", response);
     document.getElementById("chatBox").innerText = response.reply;
}

//Retrieve old chat
async function continueChat() {
   
    console.log("Frog Button clicked!");
    const loadingBox = document.getElementById("loadingPopUp");

    //show the loading page while this works, only run if they slected a prompt

    console.log(selectedPrompt);
    if(selectedPrompt){

    loadingBox.style.display = "block";
    const objectResponse = await fetch('/api/chat', {method: 'POST',headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: selectedPrompt })});

    const response = await objectResponse.json();

    // save for the next page
    localStorage.setItem("savedReply", response.reply);
    localStorage.setItem("savedPrompt", selectedPrompt);

    // then redirect
    window.location.href = "index.html";
    }
}

//Retrieve the user chats and give to frontend
let selectedPrompt = "";
let allUserLogs = [];

// Retrieve the user chats and give to frontend
async function retrieveUserChats() {
    console.log("Retrieving Chats");

    const objectUserLogs = await fetch('/api/userHistory');
    const fullUserLogs = await objectUserLogs.json();
    allUserLogs = fullUserLogs.logs || [];

    renderUserChats(allUserLogs);

    const searchBar = document.getElementById("Search");
    if (searchBar) {
    searchBar.oninput = function () {
        const searchText = searchBar.value.toLowerCase();

        const filteredLogs = allUserLogs.filter(function (chat) {
            const promptText = (chat.userMessage || "").toLowerCase();
            const replyText = (chat.reply || "").toLowerCase();

            return promptText.includes(searchText) || replyText.includes(searchText);
        });

        renderUserChats(filteredLogs);
    };
}
}

function renderUserChats(userLogs) {
    const asked = document.getElementById('ask');
    const replies = document.getElementById('replies');

    if (!asked || !replies) return;

    asked.innerHTML = "";
    replies.innerHTML = "";

    for (let i = 0; i < userLogs.length; i++) {
        const ask = document.createElement("div");
        ask.className = "asked";
        ask.textContent = userLogs[i].userMessage;
        ask.dataset.index = i;

        const reply = document.createElement("div");
        reply.className = "reply";
        reply.textContent = userLogs[i].reply;
        reply.dataset.index = i;
        reply.style.display = "none";

        ask.addEventListener("click", function () {
            const allReplies = document.querySelectorAll(".reply");
            const wasOpen = reply.style.display === "block";

            allReplies.forEach(function (r) {
                r.style.display = "none";
            });

            if (!wasOpen) {
                reply.style.display = "block";
                selectedPrompt = userLogs[i].userMessage;
            }
        });

        asked.appendChild(ask);
        replies.appendChild(reply);
    }
}


// ── Session-aware nav ─────────────────────────────────────────────────────────
async function updateNav() {
    try {
        const res  = await fetch('/api/me');
        const data = await res.json();

        const loginLink  = document.getElementById('nav-login');
        const signupLink = document.getElementById('nav-signup');
        const logoutBtn  = document.getElementById('nav-logout');
        const outfits   = document.getElementById('nav-outfits');
        const chatHistory= document.getElementById('chat-history');
        const greeting   = document.getElementById('nav-greeting');

        if (data.loggedIn) {
            console.log("Reaching logged in");
            if (loginLink)  loginLink.style.display  = 'none';
            if (signupLink) signupLink.style.display = 'none';
            //show the logout button, the chat history, outfits, and the greeting on the logged in page 
            if (logoutBtn)  logoutBtn.style.display  = 'list-item';
            if (chatHistory)  chatHistory.style.display  = 'list-item';
            if (greeting)  greeting.style.display  = 'list-item';
            if (greeting)   greeting.innerText  = `Hi, ${data.user.name}`;
            if (outfits)  outfits.style.display  = 'list-item';
            console.log(data.user.name);
        } else {
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    } catch (_) { /* server not running, ignore */ }
}

document.addEventListener('DOMContentLoaded', retrieveUserChats);
document.addEventListener('DOMContentLoaded', updateNav);
document.addEventListener('DOMContentLoaded', function () {
    retrieveUserChats();
});

window.addEventListener("DOMContentLoaded", () => {
    const savedReply = localStorage.getItem("savedReply");
    console.log("update with saved info");
    // only run if data exists
    if (!savedReply) return;

    const chatBox = document.getElementById("chatBox");

    if (chatBox) {
        chatBox.innerText = savedReply;
    }

    // clear it so it doesn't run again
    localStorage.removeItem("savedReply");
});
