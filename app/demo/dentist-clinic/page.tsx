'use client';

import Script from 'next/script';
import ChatbotProvider from '@/components/ai-chatbot-demo';
import React from 'react';

export default function DentistClinicPage(): React.JSX.Element {
  return (
      <div className="min-h-screen bg-white">

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-teal-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="text-6xl">🦷</div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Bright Smile Dental
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-teal-50 font-light max-w-3xl mx-auto">
                Your Family&apos;s Trusted Partner for Comprehensive Dental Care in Miami
              </p>
              <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 text-lg font-medium">
                ✨ New Patients Welcome • 🦷 Same-Day Appointments Available
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Where Healthy Smiles Begin
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                At Bright Smile Dental, we combine state-of-the-art technology with compassionate care
                to deliver exceptional dental services for the whole family. Our experienced team is
                dedicated to making every visit comfortable and stress-free.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500">
                <div className="text-5xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Experienced Team</h3>
                <p className="text-gray-600">Board-certified dentists with 20+ years of combined experience</p>
              </div>

              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500">
                <div className="text-5xl mb-4">🏥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Technology</h3>
                <p className="text-gray-600">Latest equipment including digital X-rays and 3D imaging</p>
              </div>

              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500">
                <div className="text-5xl mb-4">💙</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gentle Care</h3>
                <p className="text-gray-600">Anxiety-free dentistry with sedation options available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Dental Services</h2>
              <p className="text-xl text-gray-600">Comprehensive care for all your dental needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* General Dentistry */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">🦷</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">General Dentistry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Routine Cleanings & Exams</li>
                  <li>✓ Cavity Fillings</li>
                  <li>✓ Root Canals</li>
                  <li>✓ Tooth Extractions</li>
                </ul>
              </div>

              {/* Cosmetic Dentistry */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Cosmetic Dentistry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Teeth Whitening</li>
                  <li>✓ Porcelain Veneers</li>
                  <li>✓ Dental Bonding</li>
                  <li>✓ Smile Makeovers</li>
                </ul>
              </div>

              {/* Restorative Care */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Restorative Care</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Dental Crowns & Bridges</li>
                  <li>✓ Dentures</li>
                  <li>✓ Dental Implants</li>
                  <li>✓ Full Mouth Reconstruction</li>
                </ul>
              </div>

              {/* Orthodontics */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">😁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Orthodontics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Traditional Braces</li>
                  <li>✓ Invisalign Clear Aligners</li>
                  <li>✓ Retainers</li>
                  <li>✓ Bite Correction</li>
                </ul>
              </div>

              {/* Pediatric Dentistry */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Pediatric Dentistry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Children&apos;s Dental Exams</li>
                  <li>✓ Fluoride Treatments</li>
                  <li>✓ Dental Sealants</li>
                  <li>✓ Kid-Friendly Environment</li>
                </ul>
              </div>

              {/* Emergency Care */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Emergency Care</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Same-Day Appointments</li>
                  <li>✓ Dental Trauma Treatment</li>
                  <li>✓ Severe Toothaches</li>
                  <li>✓ After-Hours Emergency Line</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section with AI Assistant Prompts */}
        <div className="py-20 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Ready to Schedule Your Visit? 🦷</h2>
            <p className="text-xl mb-12 text-teal-50">
              Book an appointment today and take the first step toward a healthier, brighter smile!
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <p className="text-2xl font-bold mb-6">🤖 Try asking our AI Agent:</p>
              <div className="sample-questions text-left max-w-2xl mx-auto">
                <ul className="space-y-3 text-lg text-teal-50">
                  <li>&quot;What services do you offer?&quot;</li>
                  <li>&quot;How much does teeth whitening cost?&quot;</li>
                  <li>&quot;Do you accept my insurance?&quot;</li>
                  <li>&quot;What are your office hours?&quot;</li>
                  <li>&quot;Can I schedule a cleaning?&quot;</li>
                  <li>&quot;Do you see children?&quot;</li>
                  <li>&quot;What should I do for a dental emergency?&quot;</li>
                </ul>
              </div>
              <p className="mt-8 text-teal-100 text-lg"><em>Click the chat button in the bottom-right corner! 💬</em></p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Bright Smile Dental?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">💳 Flexible Payment Options</h3>
                <p className="text-gray-600">We accept most insurance plans and offer flexible payment plans to make dental care affordable for everyone.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">⏰ Convenient Hours</h3>
                <p className="text-gray-600">Open Monday-Saturday with early morning and evening appointments available to fit your busy schedule.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏆 Award-Winning Care</h3>
                <p className="text-gray-600">Recognized as one of Miami&apos;s top dental practices with hundreds of 5-star patient reviews.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">👨‍👩‍👧‍👦 Family-Friendly</h3>
                <p className="text-gray-600">We treat patients of all ages, from toddlers to seniors, making us your family&apos;s one-stop dental home.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Info */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us Today</h2>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-10 border border-teal-100">
              <div className="text-lg text-gray-700 space-y-4">
                <p className="text-2xl font-bold text-teal-600 mb-6">📍 Bright Smile Dental</p>
                <p><strong>Address:</strong> 1500 Biscayne Boulevard, Suite 200<br/>Miami, FL 33132</p>
                <p><strong>Phone:</strong> (305) 555-SMILE (7645)</p>
                <p><strong>Email:</strong> info@brightsmile-dental.com</p>
                <div className="pt-6 border-t border-teal-200 mt-6">
                  <p className="text-sm text-gray-600 italic">
                    Open Monday-Friday: 8:00 AM - 6:00 PM<br/>
                    Saturday: 9:00 AM - 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-12 bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-4">Questions? Our AI Agent is Here 24/7! 🤖</h3>
            <p className="text-lg text-teal-100">
              Get instant answers about our services, pricing, insurance, and schedule your appointment!
            </p>
          </div>
        </div>

        {/* AI Chatbot Widget - Replace with your actual client ID */}
        <ChatbotProvider clientId="juan-s-company-a650da01"/>
      </div>
  );
}