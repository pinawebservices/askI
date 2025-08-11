'use client';

import Script from 'next/script';
import ChatbotProvider from '@/components/ai-chatbot-demo';
import React from 'react';

export default function ApartmentsPage(): React.JSX.Element {
  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">

        {/* Hero Section with Image */}
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 text-white overflow-hidden" style={{backgroundImage: 'url(/apt-complex.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Sunset Bay Apartments
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
                Luxury Living in the Heart of Fort Lauderdale
              </p>
              <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium">
                🏖️ Just 10 Minutes to the Beach • 🛍️ 5 Minutes to Las Olas Boulevard
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome Home to Resort-Style Living ✨
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover luxury apartment living at Sunset Bay Apartments, where modern elegance meets
                prime Fort Lauderdale location. Experience the perfect blend of urban convenience and coastal lifestyle!
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-blue-100">
                <div className="text-4xl mb-4">🏊‍♀️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resort-Style Pool</h3>
                <p className="text-gray-600">Sparkling pool with cabanas, sundeck, and poolside service</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fitness Center</h3>
                <p className="text-gray-600">State-of-the-art equipment, yoga studio, and personal training</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-orange-100">
                <div className="text-4xl mb-4">🐕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pet Paradise</h3>
                <p className="text-gray-600">On-site dog park, pet washing station, and pet-friendly community</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-purple-100">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rooftop Deck</h3>
                <p className="text-gray-600">Panoramic city and water views with grilling stations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="py-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your New Home? 🏡</h2>
            <p className="text-xl mb-8 text-blue-100">
              Schedule a tour today and see why Sunset Bay is Fort Lauderdale&apos;s premier apartment community!
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <p className="text-2xl font-bold mb-6">🤖 Try asking our AI assistant:</p>
              <div className="sample-questions text-left max-w-2xl mx-auto">
                <ul className="space-y-2 text-lg text-blue-100">
                  <li>&quot;What apartments do you have available?&quot;</li>
                  <li>&quot;Show me your floor plans and pricing&quot;</li>
                  <li>&quot;What amenities do you offer?&quot;</li>
                  <li>&quot;Can I schedule a tour?&quot;</li>
                  <li>&quot;Do you allow pets?&quot;</li>
                  <li>&quot;What&apos;s included in the rent?&quot;</li>
                </ul>
              </div>
              <p className="mt-6 text-blue-100"><em>Click the blue chat button in the bottom-right corner!</em></p>
            </div>
          </div>
        </div>

        {/* Floor Plans Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Floor Plans Available 🏠</h2>
              <p className="text-xl text-gray-600">Find the perfect space for your lifestyle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Studio Apartments</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Popular</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">Starting at $1,850/month</p>
                <p className="text-gray-600 mb-4">Perfect for professionals • 650-750 sq ft</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Modern finishes & appliances</li>
                  <li>✓ In-unit washer/dryer</li>
                  <li>✓ Private balcony</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-emerald-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">One Bedroom</h3>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Most Popular!</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600 mb-2">Starting at $2,200/month</p>
                <p className="text-gray-600 mb-4">Spacious living • 850-950 sq ft</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Walk-in closet</li>
                  <li>✓ Granite countertops</li>
                  <li>✓ Water/city views available</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Two Bedroom</h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">Starting at $2,900/month</p>
                <p className="text-gray-600 mb-4">Great for roommates • 1,100-1,300 sq ft</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Open-concept layout</li>
                  <li>✓ Master suite</li>
                  <li>✓ Large kitchen island</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Penthouse</h3>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Luxury</span>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">Starting at $4,200/month</p>
                <p className="text-gray-600 mb-4">Ultimate luxury • 1,400-1,600 sq ft</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Panoramic water views</li>
                  <li>✓ Private rooftop access</li>
                  <li>✓ Premium finishes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Prime Location 📍</h2>
              <p className="text-xl text-gray-600">Everything you need is just minutes away</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🏖️</div>
                  <h3 className="font-bold text-gray-900">10 minutes</h3>
                  <p className="text-gray-600">to the beach</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🛍️</div>
                  <h3 className="font-bold text-gray-900">5 minutes</h3>
                  <p className="text-gray-600">to Las Olas Boulevard</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🚗</div>
                  <h3 className="font-bold text-gray-900">Easy access</h3>
                  <p className="text-gray-600">to major highways</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🚌</div>
                  <h3 className="font-bold text-gray-900">Public transit</h3>
                  <p className="text-gray-600">nearby</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-lg text-gray-700">
                  <strong>📍 2500 Bayview Drive, Fort Lauderdale, FL</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-12 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-4">Questions? Our AI Assistant is Here 24/7! 🤖</h3>
            <p className="text-lg text-blue-100">
              Get instant answers about pricing, availability, amenities, and schedule your tour!
            </p>
          </div>
        </div>

        {/* /!*AI Chatbot Widget -- DEV *!/*/}
        <script
            dangerouslySetInnerHTML={{
              __html: `
                        window.aiChatbotConfig = {
                            apiUrl: "http://localhost:3000",
                            businessType: "wellness", 
                            businessName: "Serenity Wellness Center",
                            customerId: "demo-wellness",
                            theme: {
                                primaryColor: "#1E88E5",
                                textColor: "#FFFFFF"
                            }
                        };
                    `
            }}
        />
        <script src="http://localhost:3000/embed.js" />

        {/*/!* AI Chatbot Widget -- PROD *!/*/}
        {/*<ChatbotProvider />*/}
      </div>
  );
}