// components/ChatbotProvider.tsx
'use client'

import { useEffect } from 'react'

interface ChatbotProviderProps {
    clientId: string;
    apiUrl?: string;
}

export default function ChatbotProvider({
    clientId,
    apiUrl = process.env.NEXT_PUBLIC_APP_URL
}: ChatbotProviderProps) {
    useEffect(() => {
        // Load script with data-client attribute
        const script = document.createElement('script')
        script.src = `${apiUrl}/embed.js`
        script.setAttribute('data-client', clientId)
        script.async = true
        document.body.appendChild(script)

        return () => {
            // Remove the script tag
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }

            // Remove the widget container that the script created
            const widgetContainer = document.getElementById('ai-agent-widget')
            if (widgetContainer) {
                widgetContainer.remove()
            }

            // Reset the loaded flag so the widget can be loaded again if needed
            if (typeof window !== 'undefined') {
                (window as any).aiChatbotLoaded = false
            }
        }
    }, [clientId, apiUrl])

    return null // This component doesn't render anything
}