document.addEventListener("DOMContentLoaded", () => {
  const chatBubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const chatHistory = document.getElementById("chat-history");
  const closeBtn = document.getElementById("close-chat");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  let isChatOpen = false;
  let initialMessageSent = false;
  let conversationHistory = []; // Array para armazenar o histórico de mensagens

  // Lista de curiosidades para a Lia
  const curiosities = [
    "A primeira mulher a ocupar o cargo de Procuradora-Geral de Justiça do Pará foi Edith Marília Maia Crespo, em 1988.",
    "O Procurador-Geral de Justiça com o maior número de mandatos na história do MPPA é Geraldo de Mendonça Rocha, que ocupou o cargo por quatro vezes.",
    "O MPPA tem um projeto específico para resgatar e preservar sua própria história, chamado Projeto Memória.",
    "Existem grupos de atuação especializados dentro do MPPA, como o GAECO, que combate o crime organizado, e o GAES, que atua na área da saúde.",
    "Gilberto Valente Martins foi o primeiro promotor de Justiça na história do MPPA a ser nomeado para o cargo de Procurador-Geral de Justiça.",
  ];

  chatBubble.addEventListener("click", () => {
    isChatOpen = !isChatOpen;
    chatWindow.style.display = isChatOpen ? "flex" : "none";
    chatBubble.style.display = "none";

    if (isChatOpen && !initialMessageSent) {
      displayInitialMessage();
      initialMessageSent = true;
    }
  });

  closeBtn.addEventListener("click", () => {
    isChatOpen = false;
    chatWindow.style.display = "none";
    chatBubble.style.display = "block";
    conversationHistory = [];
    chatHistory.innerHTML = "";
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function displayInitialMessage() {
    const randomIndex = Math.floor(Math.random() * curiosities.length);
    const randomCuriosity = curiosities[randomIndex];
    const welcomeMessage = `Olá, eu sou a Lia. Bem-vindo! Você sabia?\n${randomCuriosity}`;

    addMessageToHistory("lia", welcomeMessage);
    conversationHistory.push({ role: "assistant", content: welcomeMessage });
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessageToHistory("user", message);
    conversationHistory.push({ role: "user", content: message });
    userInput.value = "";

    fetch("http://127.0.0.1:8011/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, history: conversationHistory }),
    })
      .then((response) => response.json())
      .then((data) => {
        const liaResponse = data.response;
        addMessageToHistory("lia", liaResponse);
        conversationHistory.push({ role: "assistant", content: liaResponse });
      })
      .catch((error) => {
        console.error("Erro ao conectar com o backend:", error);
        const errorMessage = "Ocorreu um erro. Tente novamente mais tarde.";
        addMessageToHistory("lia", errorMessage);
        conversationHistory.push({ role: "assistant", content: errorMessage });
      });
  }

  function formatMarkdown(text) {
    // Substitui quebras de linha por <br>
    let formattedText = text.replace(/\n/g, "<br>");

    // Substitui *texto* por <b>texto</b>
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<b>$1</b>");

    return formattedText;
  }

  function addMessageToHistory(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "lia") {
      messageDiv.classList.add("lia-message");
      const liaIcon = document.createElement("img");
      liaIcon.src = "/static/lia-avatar.png";
      liaIcon.classList.add("lia-avatar-icon");
      messageDiv.appendChild(liaIcon);
    } else {
      messageDiv.classList.add("user-message");
    }

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.innerHTML = formatMarkdown(text); // Usa innerHTML e a nova função de formatação
    messageDiv.appendChild(contentDiv);

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
});
