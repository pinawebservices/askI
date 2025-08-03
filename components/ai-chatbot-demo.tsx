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
            customerId: string;
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
            businessType: 'apartment_complex',
            businessName: 'Sunset Bay Apartments',
            customDetails: 'Friendly and welcoming community',
            customerId: 'apt-comp-001',
            theme: {
                primaryColor: '#f97316',
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