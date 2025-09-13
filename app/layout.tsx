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
    title: "Lex - Your New Business Agent",
    description:
        "Fin is the best-performing and most powerful AI Agent, resolving more complex queries and delivering higher resolution rates than any other AI Agent.",
    generator: "v0.app",
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