import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import {FinHeader} from "@/components/landing-page/fin-header";
import {FinFooter} from "@/components/landing-page/footer";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: "WidgetWise - AI Chatbot for Lead Generation & Customer Support",
    description: "Turn your website into a 24/7 lead generation machine with WidgetWise AI chatbots. Capture more leads, answer customer questions instantly, and scale your business without hiring. Start your 14-day free trial today.",
    openGraph: {
        title: "WidgetWise - AI Chatbot for Lead Generation",
        description: "Capture more leads and provide instant customer support with AI-powered chatbots. 14-day free trial, no credit card required.",
        type: "website",
        url: "https://www.aiwidgetwise.com",
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
        </body>
        </html>
    )
}