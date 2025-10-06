'use client'
import { FinHero } from "@/components/landing-page/fin-hero"
import { ChatWidget } from "@/components/landing-page/chat-widget"
import React from "react";
import {FeaturesSection} from "@/components/landing-page/features-section";
import { PricingCards } from "@/components/landing-page/pricing-cards";
import {TestimonialsSection} from "@/components/landing-page/testimonials-section";
import { LeadGenerationInsight} from "@/components/landing-page/insights-lead-generation";
import {SavingsInsight} from "@/components/landing-page/insight-savings";
import {Divider} from "@/components/divider";
import {IntegrationInsight} from "@/components/landing-page/insights-integration";
import {IntelligenceInsight} from "@/components/landing-page/insights-intelligence";
import {CtaSection} from "@/components/landing-page/cta-section";
import ChatbotProvider from "@/components/ai-chatbot-demo";
import {FinHeader} from "@/components/landing-page/fin-header";
import {FinFooter} from "@/components/landing-page/footer";

export default function HomePage() {
  return (
      <div className="min-h-screen relative overflow-hidden bg-white">
          {/* Radial Gradient Orbs Background */}
          <div className="absolute inset-0 bg-white">
              {/* Orb 1 - Top Left */}
              <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-3xl" />

              {/* Orb 2 - Top Right */}
              <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-400 opacity-15 blur-3xl" />

              {/* Orb 3 - Bottom Left */}
              <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-400 opacity-15 blur-3xl" />

              {/* Orb 4 - Center */}
              <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-300 opacity-10 blur-3xl" />
          </div>

          {/* Your Content - Make sure it's above the background */}
          <div className="relative z-10">
              <main className="pt-16">
                  <FinHeader/>
                  <FinHero />
                  <LeadGenerationInsight />
                  <Divider />
                  <SavingsInsight />
                  <Divider />
                  <IntegrationInsight />
                  <Divider />
                  <IntelligenceInsight />
                  <PricingCards mode="landing" />
                  <CtaSection />
                  <FinFooter />
              </main>
               {/*AI Chatbot Widget -- DEV */}
              {/*<script*/}
              {/*    dangerouslySetInnerHTML={{*/}
              {/*        __html: `*/}
              {/*          window.aiChatbotConfig = {*/}
              {/*              apiUrl: "http://localhost:3000",*/}
              {/*              businessType: "Law Firm", */}
              {/*              businessName: "Morrison & Associates Law Firm",*/}
              {/*              clientId: "law-101",*/}
              {/*              theme: {*/}
              {/*                  primaryColor: "#000000",*/}
              {/*                  textColor: "#FFFFFF"*/}
              {/*              }*/}
              {/*          };*/}
              {/*      `*/}
              {/*    }}*/}
              {/*/>*/}
              {/*<script src="http://localhost:3000/embed.js" />*/}
              <script src="http://localhost:3000/embed.js" data-client="law-101"></script>

              {/*/!* AI Chatbot Widget -- PROD *!/*/}
              {/*<ChatbotProvider />*/}
          </div>
      </div>
  )
}