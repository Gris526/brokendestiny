const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Start of story
let state = {
  worldCreated: false,
  name: "",
};

const responses = {
  intro: `???:
"Hark... Another soul arrives from the fracture.\n\nSpeak thy name, wanderer, lest the VOID claim thee."`,
  askWorld: `The Architect:
"Thou must choose thy new world’s nature... Shall it be forged of ruin, wonder, or wrath?"`,
  afterWorld: `The Architect:
"It is done. Thy wish hath been made real.\nBeware—creation always comes with price."`,
};

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function handleUserInput(input) {
  if (!state.name) {
    state.name = input;
    addMessage("You", input);
    addMessage("???", `"Ah... ${state.name}. The last of your kind, perhaps."`);
    setTimeout(() => {
      addMessage("The Architect", responses.askWorld);
    }, 1000);
  } else if (!state.worldCreated) {
    addMessage("You", input);
    state.worldCreated = true;
    addMessage("The Architect", `"So be it. Thy realm shall be formed from: ${input}..."`);
    setTimeout(() => {
      addMessage("The Architect", responses.afterWorld);
      addMessage("System", "*A world of twilight forests materializes around you...*");
      setTimeout(() => {
        addMessage("???", `"Halt! You don't look like you're from around here."`);
      }, 1500);
    }, 1200);
  } else {
    addMessage("You", input);
    addMessage("???", `"Hmm... well, welcome anyway. This place isn't exactly normal."`);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (input !== "") {
    handleUserInput(input);
    userInput.value = "";
  }
});

// Start chat
window.onload = () => {
  addMessage("???", responses.intro);
};
