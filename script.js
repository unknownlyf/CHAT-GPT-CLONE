const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const newChatButton = document.querySelector("#new-chat-btn");
const historyButton = document.querySelector("#history-btn");
const upgradeButton = document.querySelector("#upgrade-btn");
const showSidebarButton = document.querySelector("#show-sidebar-btn");
const chatgpt35Button = document.querySelector("#chatgpt35-btn");
const chatgpt40Button = document.querySelector("#chatgpt40-btn");

let userText = null;

const API_KEY = "PASTE-YOUR-API-KEY-HERE"; // Paste your API key here

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text" style="text-align: right; margin-right: 30px;">
                           <h1 style="text-align: right;">ChatGPT Clone</h1>
                           <p style="text-align: right;">Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                         </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

// Event listener for the "New Chat" button
newChatButton.addEventListener("click", () => {
    chatContainer.innerHTML = "";
    const newChatMessage = `<div class="default-text">
                                <h1>CHATGPT CLONE</h1>
                                <p>Start a conversation and explore the power of AI</p>
                            </div>`;
    chatContainer.innerHTML = newChatMessage;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
});

// Event listener for the "Chat History" button
historyButton.addEventListener("click", () => {
    chatContainer.innerHTML = "";
    const chatHistory = localStorage.getItem("chat-history");
    if (chatHistory) {
        chatContainer.innerHTML = chatHistory;
    } else {
        const noHistoryMessage = `<div class="default-text">
                                    <p>No chat history available.</p>
                                </div>`;
        chatContainer.innerHTML = noHistoryMessage;
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
});

// Event listener for the "Upgrade to Plus" button
upgradeButton.addEventListener("click", () => {
    alert("Upgrade to the Premium Plan for advanced features!");
});

// Event listener for the "Show Sidebar" button
showSidebarButton.addEventListener("click", () => {
    // Add logic to show the sidebar
    alert("Show Sidebar functionality to be implemented!");
});

// Event listener for the "ChatGPT 3.5" button
chatgpt35Button.addEventListener("click", () => {
    // Handle ChatGPT 3.5 interactions here
});

// Event listener for the "ChatGPT 4.0" button
chatgpt40Button.addEventListener("click", () => {
    // Handle ChatGPT 4.0 interactions here
});

loadDataFromLocalStorage();
sendButton.addEventListener("click", handleOutgoingChat);
