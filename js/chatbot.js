document.addEventListener("DOMContentLoaded", () => {
  const chatBody = document.getElementById("chatbot-body");
  const chipsContainer = document.getElementById("chips-container");

  if (!chatBody || !chipsContainer) return;

  const faqData = [
    {
      question: "Who is Nithin?",
      answer:
        "Nithin S J is an AI and Data Science student from Coimbatore who builds AI-focused web apps, agent workflows, and full-stack tools."
    },
    {
      question: "What are your main AI interests?",
      answer:
        "My main interests are agentic AI systems, LLM orchestration, RAG pipelines, vector databases, and practical AI products that people can actually use."
    },
    {
      question: "Where are you studying?",
      answer:
        "I am pursuing B.Tech in Artificial Intelligence and Data Science at Sri Shakthi Institute of Engineering and Technology in Coimbatore."
    },
    {
      question: "What projects should I look at first?",
      answer:
        "Start with Prep4Future AI for career-focused AI, Sadhurangam for real-time multiplayer chess, Naturo-Crop for agriculture AI."
    },
    {
      question: "What technologies do you use?",
      answer:
        "I work with Python, JavaScript, TypeScript, React, Node.js, Express, LangChain, vector databases, Docker, Git, HTML, CSS, and modern deployment tools."
    },
    {
      question: "Can we collaborate?",
      answer:
        "Yes. I am open to AI projects, full-stack builds, research-style experiments, internships, and open-source collaboration. The contact section has the best ways to reach me."
    }
  ];

  function renderChips() {
    chipsContainer.innerHTML = "";

    faqData.forEach((item) => {
      const chip = document.createElement("button");
      chip.className = "suggestion-chip";
      chip.type = "button";
      chip.textContent = item.question;
      chip.addEventListener("click", () => handleQuestionClick(item));
      chipsContainer.appendChild(chip);
    });

    if (window.refreshCursorListeners) {
      window.refreshCursorListeners();
    }
  }

  function handleQuestionClick(item) {
    appendMessage(item.question, "user");
    const typingBubble = appendTypingIndicator();
    scrollChat();

    setTimeout(() => {
      typingBubble.remove();
      appendMessage(item.answer, "avatar");
      scrollChat();
    }, 700);
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${sender}`;
    bubble.textContent = text;
    chatBody.appendChild(bubble);
  }

  function appendTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className = "chat-message avatar typing-bubble";
    bubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatBody.appendChild(bubble);
    return bubble;
  }

  function scrollChat() {
    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth"
    });
  }

  renderChips();
});
