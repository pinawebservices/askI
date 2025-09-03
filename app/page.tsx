import { FinHeader } from "@/components/landing-page/fin-header"
import { FinHero } from "@/components/landing-page/fin-hero"
import { ChatWidget } from "@/components/landing-page/chat-widget"

export default function HomePage() {
  return (
      <div className="min-h-screen bg-white grid-background">
        <FinHeader />
        <main>
          <FinHero />
        </main>
        <ChatWidget />
      </div>
  )
}