'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// Define the message type interface
interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

// Define the component props interface
interface ChatDemoAnimationProps {
    messages?: Message[];
    businessName?: string;
    primaryColor?: string;
    typingDelay?: number;
    messageDelay?: number;
    loop?: boolean;
    loopDelay?: number;
}

// Default messages if none provided
const defaultMessages: Message[] = [
    { role: "assistant", content: "Hi! I'm here to help answer your questions about our dental services. How can I assist you today?" },
    { role: "user", content: "Do you accept Delta Dental insurance? I need a cleaning" },
    { role: "assistant", content: "Yes, we accept Delta Dental! We offer multiple cleaning services, would you like to know more about them?" },
    { role: "user", content: "Yes, what are my options?" },
    { role: "assistant", content: "We offer three types of cleanings:\n\n• **Routine Cleaning** - $89\nStandard preventive cleaning for healthy gums\n\n• **Deep Cleaning** - $180 per quadrant\nFor patients with gum disease, removes buildup below the gum line\n\n• **Periodontal Maintenance** - $120\nOngoing care after deep cleaning treatment\n\nWhich one sounds right for you?" },
    { role: "user", content: "The routine cleaning sounds good" },
    { role: "assistant", content: "Great! I'd be happy to help you get scheduled for a routine cleaning.\n\nMay I have your name?" },
    { role: "user", content: "Sarah Johnson" },
    { role: "assistant", content: "Thanks Sarah! What's the best phone number to reach you?" },
    { role: "user", content: "555-234-5678" },
    { role: "assistant", content: "Perfect! And your email address?" },
    { role: "user", content: "sarah.j@email.com" },
    { role: "assistant", content: "Thank you! I've captured your information:\n\n• **Name:** Sarah Johnson\n• **Phone:** 555-234-5678\n• **Email:** sarah.j@email.com\n• **Service:** Routine Cleaning\n• **Insurance:** Delta Dental\n\nOur team will contact you shortly to schedule your appointment!" }
];


const ChatDemoAnimation = ({
                               messages = [],
                               businessName = "AI Agent",
                               primaryColor = "#07dfc9",
                               typingDelay = 1500, // How long to show typing dots before message appears
                               messageDelay = 3000, // Delay between messages
                               loop = true,
                               loopDelay = 20000 // Delay before restarting the animation
                           }) => {
    const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentTypingMessage, setCurrentTypingMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const messagesToShow = useMemo(() => {
        return messages.length > 0 ? messages : defaultMessages;
    }, [messages]);

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        const runAnimation = () => {
            // Clear any existing state
            setVisibleMessages([]);
            setIsTyping(false);

            let currentDelay = 500; // Initial delay before first message

            messagesToShow.forEach((message, index) => {
                if (message.role === "assistant") {
                    // Show typing indicator first
                    const typingTimeout = setTimeout(() => {
                        setIsTyping(true);
                        setCurrentTypingMessage(message.content);
                    }, currentDelay);
                    timeouts.push(typingTimeout);

                    currentDelay += typingDelay;

                    // Then show the actual message
                    const messageTimeout = setTimeout(() => {
                        setIsTyping(false);
                        setVisibleMessages(prev => [...prev, {
                            ...message,
                            timestamp: new Date()
                        }]);
                    }, currentDelay);
                    timeouts.push(messageTimeout);
                } else {
                    // User messages appear immediately after assistant messages
                    const userTimeout = setTimeout(() => {
                        setVisibleMessages(prev => [...prev, {
                            ...message,
                            timestamp: new Date()
                        }]);
                    }, currentDelay);
                    timeouts.push(userTimeout);
                }

                currentDelay += messageDelay;
            });

            // Loop if enabled
            if (loop) {
                const loopTimeout = setTimeout(() => {
                    runAnimation();
                }, currentDelay + loopDelay);
                timeouts.push(loopTimeout);
            }
        };

        runAnimation();

        // Cleanup
        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [messagesToShow, typingDelay, messageDelay, loop, loopDelay]);

    // Add this new useEffect after your existing one:
    useEffect(() => {
        if (messagesEndRef.current && containerRef.current) {
            // Smooth scroll to bottom
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [visibleMessages, isTyping]);

    // Format message content (handle bold text with **)
    const formatContent = (content: string) => {
        const parts = content.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index} className="font-semibold">{part}</strong>;
            }
            return part.split('\n').map((line, lineIndex) => (
                <React.Fragment key={`${index}-${lineIndex}`}>
                    {lineIndex > 0 && <br />}
                    {line}
                </React.Fragment>
            ));
        });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div
                    className="text-white p-4 flex justify-between items-center border-b border-white/20 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div>
                        <h3 className="font-semibold text-base">{businessName}</h3>
                        <p className="text-sm opacity-90">Powered by WidgetWise.</p>
                    </div>
                    <button className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Container */}
                <div ref={containerRef} className="h-80 overflow-y-auto p-4 bg-gray-50">
                    <div className="space-y-3">
                        {visibleMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex animate-fadeIn ${
                                    message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                        message.role === "user"
                                            ? "text-white"
                                            : "bg-white text-gray-800 border border-gray-200"
                                    }`}
                                    style={{
                                        backgroundColor: message.role === "user" ? primaryColor : undefined,
                                    }}
                                >
                                    <div className="leading-relaxed">
                                        {formatContent(message.content)}
                                    </div>
                                    <div className={`text-xs mt-1 ${
                                        message.role === "user" ? "text-white/70" : "text-gray-500"
                                    }`}>
                                        {message.timestamp?.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        />
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled
                        />
                        <button
                            className="px-3 py-2 text-white rounded-md opacity-50 cursor-not-allowed"
                            style={{ backgroundColor: primaryColor }}
                            disabled
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
          }
          40% {
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default ChatDemoAnimation;