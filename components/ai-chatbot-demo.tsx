// components/ChatbotProvider.tsx
'use client'

import { useEffect } from 'react'

// Declare the custom property on window object
declare global {
    interface Window {
        aiChatbotConfig?: {
            apiUrl: string;
            businessType: string;
            businessName: string;
            customDetails?: string;
            clientId: string;
            theme: {
                primaryColor: string;
                textColor: string;
            };
        };
    }
}

export default function ChatbotProvider() {
    useEffect(() => {
        // Configure chatbot
        window.aiChatbotConfig = {
            apiUrl: 'https://aski-chatbot.vercel.app',
            businessType: "Law Firm",
            businessName: "Morrison & Associates Law Firm",
            clientId: "law-101",
            theme: {
                primaryColor: '#000000',
                textColor: '#FFFFFF'
            }
        }

        // Load script
        const script = document.createElement('script')
        script.src = 'https://aski-chatbot.vercel.app/embed.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    }, [])

    return null // This component doesn't render anything
}