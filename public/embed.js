// public/embed.js - FULL VERSION
(function () {
  console.log("🚀 Embed script starting...");

  // Configuration
  const config = window.aiChatbotConfig || {
    apiUrl: "http://localhost:3000",
    businessType: "restaurant",
    businessName: "Your Business",
    customDetails: "",
    theme: {
      primaryColor: "#2563EB",
      textColor: "#FFFFFF",
    },
  };

  // Check if widget already loaded
  if (window.aiChatbotLoaded) return;
  window.aiChatbotLoaded = true;

  // Create widget container
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "ai-chatbot-widget";
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Widget state
  let isOpen = false;
  let messages = [
    {
      role: "assistant",
      content: `Hi! Welcome to ${config.businessName}. How can I help you today?`,
      timestamp: new Date(),
    },
  ];

  // Create floating button
  function createFloatingButton() {
    const button = document.createElement("button");
    button.style.cssText = `
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: ${config.theme.primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    `;

    button.innerHTML = `
      <svg id="Layer_1" width="48" height="48" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.25 108.52">
        <defs>
          <style>
            .cls-1 {
              fill: #ffffff;
              fill-rule: evenodd;
            }
          </style>
          </defs>
          <path class="cls-1" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
          <path class="cls-1" d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
          <path class="cls-1" d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
       </svg>
    `;

    button.onmouseover = () => {
      button.style.transform = "scale(1.1)";
      button.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
    };

    button.onmouseout = () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    };

    button.onclick = toggleWidget;
    return button;
  }

  // Create chat window
  function createChatWindow() {
    const chatWindow = document.createElement("div");
    chatWindow.style.cssText = `
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 20px;
    `;

    chatWindow.innerHTML = `
      <div style="
        background-color: ${config.theme.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${config.businessName}</h3>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">We&apos;re here to help!</p>
        </div>
        <button id="close-chat" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
        ">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div id="messages-container" style="
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f9fafb;
      "></div>
      
      <div style="
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        background: white;
      ">
        <div style="display: flex; gap: 8px;">
          <input 
            id="message-input" 
            type="text" 
            placeholder="Type your message..."
            style="
              flex: 1;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              outline: none;
              font-size: 14px;
            "
          />
          <button id="send-button" style="
            background-color: ${config.theme.primaryColor};
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    return chatWindow;
  }

  // Toggle widget open/close
  function toggleWidget() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById("chat-window");
    const floatingButton = document.getElementById("floating-button");

    if (isOpen) {
      chatWindow.style.display = "flex";
      floatingButton.style.display = "none";
      renderMessages();
      const input = document.getElementById("message-input");
      if (input) input.focus();
    } else {
      chatWindow.style.display = "none";
      floatingButton.style.display = "flex";
    }
  }

  // Render messages
  function renderMessages() {
    const container = document.getElementById("messages-container");
    if (!container) return;

    container.innerHTML = "";

    messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.style.cssText = `
        display: flex;
        margin-bottom: 16px;
        ${
          message.role === "user"
            ? "justify-content: flex-end;"
            : "justify-content: flex-start;"
        }
      `;

      messageDiv.innerHTML = `
        <div style="
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          ${
            message.role === "user"
              ? `background-color: ${config.theme.primaryColor}; color: white;`
              : "background-color: white; color: #374151; border: 1px solid #e5e7eb;"
          }
        ">
          ${message.content}
          <div style="
            font-size: 11px;
            margin-top: 4px;
            opacity: 0.7;
          ">
            ${message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      `;

      container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
  }

  // Send message
  async function sendMessage(text) {
    if (!text.trim()) return;

    console.log("📤 Sending message:", text);

    // Add user message
    messages.push({
      role: "user",
      content: text,
      timestamp: new Date(),
    });
    renderMessages();

    // Show typing indicator
    showTypingIndicator();

    try {
      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          businessType: config.businessType,
          customDetails: config.customDetails,
          customerId: config.customerId
        }),
      });

      const data = await response.json();

      // Remove typing indicator
      hideTypingIndicator();

      if (data.message) {
        messages.push({
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        });
        renderMessages();
        console.log("✅ Response received");
      }
    } catch (error) {
      console.error("❌ Chat error:", error);
      hideTypingIndicator();

      messages.push({
        role: "assistant",
        content:
          "I apologize, but I&apos;m having trouble responding right now. Please try again in a moment or call us directly.",
        timestamp: new Date(),
      });
      renderMessages();
    }
  }

  function showTypingIndicator() {
    const container = document.getElementById("messages-container");
    if (!container) return;

    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.style.cssText =
      "display: flex; justify-content: flex-start; margin-bottom: 16px;";
    typingDiv.innerHTML = `
      <div style="
        background-color: white;
        border: 1px solid #e5e7eb;
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 14px;
      ">
        <div style="display: flex; gap: 4px;">
          <div class="bounce-dot" style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%;"></div>
          <div class="bounce-dot" style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%;"></div>
          <div class="bounce-dot" style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%;"></div>
        </div>
      </div>
    `;

    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) typingIndicator.remove();
  }

  // Initialize widget
  function initWidget() {
    try {
      // Create elements
      const floatingButton = createFloatingButton();
      floatingButton.id = "floating-button";

      const chatWindow = createChatWindow();
      chatWindow.id = "chat-window";

      // Add to container
      widgetContainer.appendChild(chatWindow);
      widgetContainer.appendChild(floatingButton);

      // Add event listeners
      setTimeout(() => {
        const closeButton = document.getElementById("close-chat");
        const messageInput = document.getElementById("message-input");
        const sendButton = document.getElementById("send-button");

        if (closeButton) closeButton.onclick = toggleWidget;

        if (sendButton) {
          sendButton.onclick = () => {
            const input = document.getElementById("message-input");
            if (input && input.value.trim()) {
              sendMessage(input.value);
              input.value = "";
            }
          };
        }

        if (messageInput) {
          messageInput.onkeypress = (e) => {
            if (e.key === "Enter") {
              sendMessage(messageInput.value);
              messageInput.value = "";
            }
          };
        }
      }, 100);

      // Add CSS for animations
      const style = document.createElement("style");
      style.textContent = `
        .bounce-dot {
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .bounce-dot:nth-child(1) { animation-delay: -0.32s; }
        .bounce-dot:nth-child(2) { animation-delay: -0.16s; }
        .bounce-dot:nth-child(3) { animation-delay: 0s; }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);

      // Add to page
      document.body.appendChild(widgetContainer);

      console.log("✅ Full widget initialized successfully!");
    } catch (error) {
      console.error("❌ Error initializing widget:", error);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
