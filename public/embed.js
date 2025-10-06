// public/embed.js - Enhanced with structured response formatting
// Capture at the top level - THIS WORKS
const CAPTURED_SCRIPT = document.currentScript;
const CAPTURED_CLIENT_ID = CAPTURED_SCRIPT?.getAttribute('data-client');
const CAPTURED_SCRIPT_SRC = CAPTURED_SCRIPT?.src;


(function (clientId, scriptSrc) {

  if (!clientId) {
    console.error('❌ No client ID found. Make sure to include data-client="your-client-id"');
    return;
  }

  // DEBUG
  // console.log("📡 Loading configuration for:", clientId);

  // Check if widget already loaded
  if (window.aiChatbotLoaded) return;
  window.aiChatbotLoaded = true;

  // Derive API URL from script source
  const apiBaseUrl = scriptSrc ?
      scriptSrc.substring(0, scriptSrc.lastIndexOf('/')) :
      window.location.origin;  // Fallback to current origin
  const currentDomain = window.location.origin;

  // DEBUG
  // console.log(`API URL: ${apiBaseUrl}`);
  // console.log(`Fetching: ${apiBaseUrl}/api/widget-config/${clientId}?domain=${encodeURIComponent(currentDomain)}`);

  fetch(`${apiBaseUrl}/api/widget-config/${clientId}?domain=${encodeURIComponent(currentDomain)}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Invalid client ID or inactive account');
          }
          throw new Error('Failed to load configuration');
        }
        return res.json();
      })
      .then(config => {
        // Initialize with fetched config
        initializeWidget({
          ...config,
          // Add any defaults
          businessName: 'AI Assistant',
          theme: {
            primaryColor: '#000000',
            textColor: '#ffffff',
            ...config.theme
          }
        });
      })
      .catch(error => {
        console.error('❌ AI Chatbot initialization failed:', error.message);
      });

  function initializeWidget(config) {
    // Enhanced markdown parser for structured responses
    function parseMarkdownMessage(content) {
      // First, convert basic markdown
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\n/g, '<br>');

      // Parse structured apartment/service listings with exact formatting
      // Pattern: **Title** followed by **Price:**, **Size/Duration:**, **Includes:**, **Notes:**
      content = content.replace(
          /(<strong>[^<]+(?:Apartment|Service|Massage|Bodywork|Treatment)[^<]*<\/strong>)<br>\s*(<strong>Price:<\/strong>[^<]+)<br>\s*(<strong>(?:Size|Duration):<\/strong>[^<]+)<br>\s*(<strong>Includes:<\/strong>[^<]+)<br>\s*(<strong>Notes:<\/strong>[^<]+)/g,
          function(match, title, price, size, includes, notes) {
            return `<div class="listing-card">
          <div class="listing-title">${title}</div>
          <div class="listing-field">${price}</div>
          <div class="listing-field">${size}</div>
          <div class="listing-field">${includes}</div>
          <div class="listing-field">${notes}</div>
        </div>`;
          }
      );

      return content;
    }

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

    function createFloatingButton() {

      // Create wrapper for button and message
      const floatingButtonWrapper = document.createElement("div");
      floatingButtonWrapper.style.cssText = `
      position: relative;
      display: inline-block;
    `;

      // Create message popup
      const messagePopup = document.createElement("div");
      messagePopup.style.cssText = `
      position: absolute;
      bottom: 80px;  /* Adjust distance above button */
      right: 0;
      background: white;
      color: #1f2937;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      z-index: 10002;  /* Higher than chat window */
      display: none;
    `;
      messagePopup.className = "chat-message-popup chat-message-pulse";
      messagePopup.innerHTML = `
      <span>👋 I can help you with any question!</span>
      <span class="chat-message-close" style="margin-left: 8px; cursor: pointer; opacity: 0.6;">✕</span>
    `;
      messagePopup.style.display = "none"; // Hidden initially

      const floatingButton = document.createElement("button");

      floatingButton.className = "chat-widget-bounce";
      floatingButton.style.cssText = `
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: ${config.theme.primaryColor};
      color: ${config.theme.textColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    `;

      floatingButton.innerHTML = `
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

      floatingButton.onmouseover = () => {
        floatingButton.style.transform = "scale(1.1)";
        floatingButton.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
      };

      floatingButton.onmouseout = () => {
        floatingButton.style.transform = "scale(1)";
        floatingButton.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      };

      floatingButton.onclick = toggleWidget;

      // Handle message close button
      messagePopup.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-message-close')) {
          messagePopup.style.display = 'none';
        }
      });

      // Add both to wrapper
      floatingButtonWrapper.appendChild(messagePopup);
      floatingButtonWrapper.appendChild(floatingButton);

      // Show message after 3 seconds
      setTimeout(() => {
        if (!isOpen) { // Only show if chat is still closed
          messagePopup.style.display = "block";
        }
      }, 3000);

      // // Hide message after 15 seconds total
      // setTimeout(() => {
      //   messagePopup.style.display = "none";
      // }, 15000);

      return floatingButtonWrapper;
    }

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
              color: #171717;
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

        // Parse content for assistant messages
        let processedContent = message.content;
        if (message.role === "assistant") {
          processedContent = parseMarkdownMessage(message.content);
        }

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
          ${processedContent}
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

    async function sendMessage(message) {

      // // Always create new conversation ID
      // let conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Retrieve Existing or Generate new conversation ID
      let conversationId = sessionStorage.getItem('embed_conversationId');
      const getOrCreateConversationId = (conversationId) => {
        if (!conversationId || messages.length <= 2) {
          conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('embed_conversationId', conversationId);
          // DEBUG
          // console.log('📝 [Embed] Created new conversation ID:', conversationId);
        } else {
          // DEBUG
          //console.log('📝 [Embed] Using existing conversation ID:', conversationId);
        }
        return conversationId;
      }

      // Prepare the message
      const userMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      // Add user message
      messages.push(userMessage);
      renderMessages();

      // Show typing indicator
      showTypingIndicator();

      // DEBUG
      // console.log('📤 [Embed] Sending to API:', {
      //   conversationId: conversationId,
      //   messageCount: messages.length,
      //   hasApiKey: !!config.apiKey
      // });

      try {
        const response = await fetch(`${config.apiUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": config.apiKey
          },
          body: JSON.stringify({
            messages: messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            conversationId: getOrCreateConversationId(conversationId)
          }),
        });

        if (!response.ok) {
          throw new Error(" ❌ Failed to send message");
        }

        const data = await response.json();
        // DEBUG
        //console.log('📥 [Embed] Response received:', data);

        // Remove typing indicator
        hideTypingIndicator();

        const assistantMessage = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        if (assistantMessage) {
          messages.push(assistantMessage);
          renderMessages();
          // DEBUG
          // console.log("✅ Response received");

          // ADD THIS: Log Pinecone debug info if available
          // DEBUG
          // if (data.debug) {
          //   console.log("📊 Pinecone stats:", {
          //     chunksUsed: data.debug.chunksUsed,
          //     contextSize: data.debug.contextSize,
          //     topScore: data.debug.topScore
          //   });
          // }
        }
      } catch (error) {
        console.error("❌ Chat error:", error);
        hideTypingIndicator();

        messages.push({
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment or call us directly.",
          timestamp: new Date(),
        });
        renderMessages();
      }
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

    function initWidget() {
      try {
        // Create elements
        const floatingButton = createFloatingButton();
        floatingButton.id = "floating-button";

        const chatWindow = createChatWindow();
        chatWindow.id = "chat-window";
        chatWindow.style.zIndex = "10001"; // Make sure this has a z-index

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

        // Add CSS for animations and formatting
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

        /* Enhanced structured message formatting */
        .listing-card {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          padding: 16px !important;
          margin: 12px 0 !important;
          line-height: 1.6 !important;
        }
        
        .listing-title {
          font-weight: bold !important;
          font-size: 16px !important;
          color: #1e40af !important;
          margin-bottom: 8px !important;
          padding-bottom: 4px !important;
          border-bottom: 2px solid #e2e8f0 !important;
        }
        
        .listing-field {
          margin: 6px 0 !important;
          line-height: 1.5 !important;
        }
        
        .listing-field strong {
          color: #1e40af !important;
          font-weight: bold !important;
        }
        
        .listing-card + .listing-card {
          margin-top: 16px !important;
        }
        
        /* Hide consecutive line breaks in formatted content */
        br + br {
          display: none;
        }
        
        /* Chat Message Popup - Add these styles here */
  .chat-message-popup {
    position: absolute;
    bottom: 110%;
    right: 0;
    background: white;
    color: #1f2937;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    animation: slideInUp 0.4s ease-out;
    z-index: 10001;
  }
  
  .chat-message-popup::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 20px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }
  
  .chat-message-close {
    margin-left: 8px;
    padding: 2px;
    cursor: pointer;
    opacity: 0.6;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
      `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(widgetContainer);

        // DEBUG
        // console.log("✅ Full widget initialized successfully!");
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
  }

//   // ADD THIS TEST FUNCTION at the end of your embed.js (before the final })();)
// // This lets you test Pinecone directly from browser console
//   if (process.env.NODE_ENV === 'development' || window.location.hostname === '127.0.0.1') {
//     window.testChat = async function(message) {
//       console.log('🧪 Testing chat with:', message);
//
//       try {
//         const response = await fetch(`${config.apiUrl}/api/chat`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-Key": config.apiKey  // Uses the widget's API key
//           },
//           body: JSON.stringify({
//             messages: [{ role: "user", content: message }],
//             conversationId: `test_${Date.now()}`
//           })
//         });
//
//         const data = await response.json();
//         console.log('✅ Response:', data.message);
//         if (data.debug) {
//           console.log('📊 Debug info:', data.debug);
//         }
//         return data;
//       } catch (error) {
//         console.error('❌ Test failed:', error);
//       }
//     };
//
//     console.log('💡 Dev mode: Use window.testChat("your question") to test the API');
//   }

})(CAPTURED_CLIENT_ID, CAPTURED_SCRIPT_SRC);