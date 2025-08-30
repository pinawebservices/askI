// components/ChatWidget.js - Enhanced with markdown rendering
"use client";

import { useState, useRef, useEffect } from "react";

// Simple markdown parser for structured responses
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

// Component for rendering formatted messages
function FormattedMessage({ content }) {
  const formattedContent = parseMarkdownMessage(content);

  return (
      <div
          className="formatted-message"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
  );
}

export default function ChatWidget({
                                     businessType = "default",
                                     customDetails = "",
                                     businessName = "Our Business",
                                     isOpen = false,
                                     onToggle = () => {},
                                     isEmbedded = false,
                                   }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! Welcome to ${businessName}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [clientId, setClientId] = useState('demo-wellness');
  const [conversationId, setConversationId] = useState(null);

  // Generate conversation ID once when widget loads
  useEffect(() => {
    // Get ClientId from Windows Config
    const configClientId = window.chatWidgetConfig?.clientId;
    if (configClientId) {
      setClientId(configClientId);
    }

    // Check if existing conversation in session
    let convId = sessionStorage.getItem('conversationId');
    const savedMessages = sessionStorage.getItem('chatMessages');

    if (convId && savedMessages) {
      setConversationId(convId);
      setMessages(JSON.parse(savedMessages));
    } else {
      convId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('conversationId', convId);
      setConversationId(convId);
    }

    setConversationId(convId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          businessType,
          customDetails,
          clientId: clientId,
          conversationId: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
              "I apologize, but I'm having trouble responding right now. Please try again in a moment or call us directly.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && isEmbedded) {
    return (
        <button
            onClick={onToggle}
            className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
            aria-label="Open chat"
        >
          <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.804-.9L3 21l1.9-6.196A8.955 8.955 0 013 12a8 8 0 018-8 8 8 0 018 8z"
            />
          </svg>
        </button>
    );
  }

  return (
      <>
        {/* CSS for formatted messages */}
        <style jsx>{`
        .formatted-message .listing-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
          line-height: 1.6;
        }
        
        .formatted-message .listing-title {
          font-weight: bold;
          font-size: 16px;
          color: #1e40af;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .formatted-message .listing-field {
          margin: 6px 0;
          line-height: 1.5;
        }
        
        .formatted-message .listing-field strong {
          color: #1e40af;
          font-weight: bold;
        }
        
        .formatted-message .listing-card + .listing-card {
          margin-top: 16px;
        }
        
        .formatted-message br + br {
          display: none;
        }
        
        .formatted-message {
          line-height: 1.5;
        }
      `}</style>

        <div
            className={`${
                isEmbedded ? "fixed bottom-4 right-4 z-50" : "w-full max-w-md mx-auto"
            } bg-white rounded-lg shadow-lg border`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{businessName}</h3>
              <p className="text-sm opacity-90">We&apos;re here to help!</p>
            </div>
            {isEmbedded && (
                <button
                    onClick={onToggle}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Close chat"
                >
                  <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
            )}
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === "user"
                              ? "bg-blue-600 text-white"
                              : message.isError
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {message.role === "assistant" && !message.isError ? (
                        <FormattedMessage content={message.content} />
                    ) : (
                        <p className="text-sm">{message.content}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
              />
              <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </>
  );
}