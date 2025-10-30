'use client';

import Script from 'next/script';
import ChatbotProvider from '@/components/ai-chatbot-demo';
import React from 'react';

export default function LawFirmPage(): React.JSX.Element {
  return (
      <div className="min-h-screen bg-white">

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="text-6xl">⚖️</div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Sterling & Associates Law Firm
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light max-w-3xl mx-auto">
                Trusted Legal Counsel in South Florida for Over 25 Years
              </p>
              <div className="inline-flex bg-amber-500/20 backdrop-blur-sm rounded-full px-8 py-4 text-lg font-medium border border-amber-400/30">
                🏆 Award-Winning Attorneys • 📞 Free Initial Consultation
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-gray-50 py-6 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-900">25+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">$50M+</div>
                <div className="text-sm text-gray-600">Recovered for Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">2,500+</div>
                <div className="text-sm text-gray-600">Cases Won</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">98%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Rights. Our Priority.
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Sterling & Associates provides aggressive representation and compassionate guidance
                across a wide range of legal matters. Our experienced attorneys are committed to
                achieving the best possible outcomes for our clients through strategic advocacy and
                personalized attention.
              </p>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-900">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Track Record</h3>
                <p className="text-gray-600">25+ years of successful litigation and settlements across Florida</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-900">
                <div className="text-5xl mb-4">👔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Legal Team</h3>
                <p className="text-gray-600">Board-certified specialists with advanced legal credentials</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-900">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Client-Focused</h3>
                <p className="text-gray-600">Personalized service with direct attorney access throughout your case</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Areas Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Practice Areas</h2>
              <p className="text-xl text-gray-600">Comprehensive legal services across multiple disciplines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Injury */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Personal Injury</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Car & Motorcycle Accidents</li>
                  <li>• Slip & Fall Cases</li>
                  <li>• Medical Malpractice</li>
                  <li>• Wrongful Death Claims</li>
                  <li>• Workers&apos; Compensation</li>
                </ul>
              </div>

              {/* Family Law */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">👨‍👩‍👧</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Family Law</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Divorce & Separation</li>
                  <li>• Child Custody & Support</li>
                  <li>• Alimony & Spousal Support</li>
                  <li>• Adoption Services</li>
                  <li>• Prenuptial Agreements</li>
                </ul>
              </div>

              {/* Criminal Defense */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Criminal Defense</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• DUI/DWI Defense</li>
                  <li>• Drug Offenses</li>
                  <li>• Theft & White Collar Crimes</li>
                  <li>• Assault & Battery</li>
                  <li>• Record Expungement</li>
                </ul>
              </div>

              {/* Business Law */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Law</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Business Formation & LLC</li>
                  <li>• Contract Drafting & Review</li>
                  <li>• Business Litigation</li>
                  <li>• Mergers & Acquisitions</li>
                  <li>• Employment Law</li>
                </ul>
              </div>

              {/* Estate Planning */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Estate Planning</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Wills & Trusts</li>
                  <li>• Estate Administration</li>
                  <li>• Probate Services</li>
                  <li>• Powers of Attorney</li>
                  <li>• Asset Protection Planning</li>
                </ul>
              </div>

              {/* Real Estate Law */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Estate Law</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Residential Transactions</li>
                  <li>• Commercial Real Estate</li>
                  <li>• Title & Closing Services</li>
                  <li>• Property Disputes</li>
                  <li>• Landlord-Tenant Law</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section with AI Assistant Prompts */}
        <div className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Need Legal Advice? We&apos;re Here to Help ⚖️</h2>
            <p className="text-xl mb-12 text-blue-100">
              Schedule your free consultation today and let our experienced attorneys fight for your rights.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-amber-400/30">
              <p className="text-2xl font-bold mb-6">🤖 Try asking our AI Agent:</p>
              <div className="sample-questions text-left max-w-2xl mx-auto">
                <ul className="space-y-3 text-lg text-blue-100">
                  <li>&quot;What types of cases do you handle?&quot;</li>
                  <li>&quot;How much does a consultation cost?&quot;</li>
                  <li>&quot;What should I do after a car accident?&quot;</li>
                  <li>&quot;Do you handle divorce cases?&quot;</li>
                  <li>&quot;Can you help with a DUI charge?&quot;</li>
                  <li>&quot;How long does a personal injury case take?&quot;</li>
                  <li>&quot;What are your attorney fees?&quot;</li>
                </ul>
              </div>
              <p className="mt-8 text-blue-100 text-lg"><em>Click the chat button in the bottom-right corner! 💬</em></p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Sterling & Associates?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">💰 No Win, No Fee Guarantee</h3>
                <p className="text-gray-600">For personal injury cases, you pay nothing unless we win your case. We work on a contingency fee basis.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📞 24/7 Availability</h3>
                <p className="text-gray-600">Legal emergencies don&apos;t wait. Our attorneys are available around the clock for urgent matters.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏆 Proven Results</h3>
                <p className="text-gray-600">Over $50 million recovered for our clients with a 98% success rate in settled and tried cases.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎓 Board-Certified Specialists</h3>
                <p className="text-gray-600">Our attorneys hold advanced certifications and are recognized leaders in their respective fields.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🌐 Bilingual Services</h3>
                <p className="text-gray-600">We serve clients in English and Spanish, ensuring clear communication throughout your case.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-l-4 border-blue-900">
                <h3 className="text-xl font-bold text-gray-900 mb-3">⚡ Fast Response Time</h3>
                <p className="text-gray-600">We understand time is critical. Expect a response to your inquiry within 2 hours during business hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <p className="text-gray-600">Real results from real clients</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-amber-500 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-4">
                  &quot;After my accident, Sterling & Associates fought tirelessly for me. They secured a settlement that covered all my medical bills and lost wages. Highly recommend!&quot;
                </p>
                <p className="font-bold text-gray-900">- Maria R.</p>
                <p className="text-sm text-gray-500">Personal Injury Client</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-amber-500 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-4">
                  &quot;Professional, knowledgeable, and compassionate. They guided me through my divorce with care and secured a fair outcome. Thank you!&quot;
                </p>
                <p className="font-bold text-gray-900">- James T.</p>
                <p className="text-sm text-gray-500">Family Law Client</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-amber-500 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-4">
                  &quot;Their business law team helped us with our LLC formation and contracts. Expert advice, fair pricing, and excellent communication throughout.&quot;
                </p>
                <p className="font-bold text-gray-900">- David L.</p>
                <p className="text-sm text-gray-500">Business Law Client</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Info */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Our Office</h2>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-10 border border-blue-200">
              <div className="text-lg text-gray-700 space-y-4">
                <p className="text-2xl font-bold text-blue-900 mb-6">⚖️ Sterling & Associates Law Firm</p>
                <p><strong>Main Office:</strong> 777 Brickell Avenue, Suite 1500<br/>Miami, FL 33131</p>
                <p><strong>Phone:</strong> (305) 555-LAWFIRM (529-3476)</p>
                <p><strong>Email:</strong> info@sterling-law.com</p>
                <p className="text-sm text-gray-600 pt-4">
                  <strong>Additional Locations:</strong> Fort Lauderdale • West Palm Beach • Naples
                </p>
                <div className="pt-6 border-t border-blue-200 mt-6">
                  <p className="text-sm text-gray-600">
                    Office Hours: Monday-Friday: 8:00 AM - 6:00 PM<br/>
                    Saturday: By Appointment Only<br/>
                    <strong className="text-blue-900">24/7 Emergency Line: (305) 555-9999</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-12 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-4">Questions? Our AI Agent is Here 24/7! 🤖</h3>
            <p className="text-lg text-blue-100">
              Get instant answers about our services, case types, fees, and schedule your free consultation!
            </p>
            <p className="text-sm text-blue-200 mt-4 italic">
              Note: This AI assistant provides general information only and does not constitute legal advice.
            </p>
          </div>
        </div>

        {/* AI Chatbot Widget - Replace with your actual client ID */}
        <ChatbotProvider clientId="demo-law-firm"/>
      </div>
  );
}