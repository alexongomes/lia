document.addEventListener("DOMContentLoaded", () => {
  const chatBubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const chatHistory = document.getElementById("chat-history");
  const closeBtn = document.getElementById("close-chat");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  let isChatOpen = false;

  chatBubble.addEventListener("click", () => {
    isChatOpen = !isChatOpen;
    chatWindow.style.display = isChatOpen ? "flex" : "none";
    chatBubble.style.display = "none"; // Oculta o balão quando a janela está aberta
  });

  closeBtn.addEventListener("click", () => {
    isChatOpen = false;
    chatWindow.style.display = "none";
    chatBubble.style.display = "block"; // Mostra o balão novamente
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    // Adiciona a mensagem do usuário ao histórico
    addMessageToHistory("user", message);

    // Limpa o input
    userInput.value = "";

    // Simula uma chamada ao backend
    fetch("http://127.0.0.1:8011/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Adiciona a resposta da Lia ao histórico
        addMessageToHistory("lia", data.response);
      })
      .catch((error) => {
        console.error("Erro ao conectar com o backend:", error);
        addMessageToHistory(
          "lia",
          "Ocorreu um erro. Tente novamente mais tarde."
        );
      });
  }

  function addMessageToHistory(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "lia") {
      messageDiv.classList.add("lia-message");
      const liaIcon = document.createElement("img");
      liaIcon.src = "/static/lia-avatar.png"; // Ajuste aqui
      liaIcon.classList.add("lia-avatar-icon");
      messageDiv.appendChild(liaIcon);
    } else {
      messageDiv.classList.add("user-message");
    }

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
});
