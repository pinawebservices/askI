// app/demo/page.js
'use client';

import { useState } from 'react';
import ChatWidget from '@/components/ChatWidget';

const businessTypes = [
    { id: 'restaurant', name: 'Restaurant', description: 'Handles reservations, menu questions, hours' },
    { id: 'salon', name: 'Hair Salon', description: 'Books appointments, discusses services and pricing' },
    { id: 'auto_repair', name: 'Auto Repair', description: 'Schedules estimates, explains services' },
    { id: 'default', name: 'General Business', description: 'Basic customer service assistant' }
];

export default function DemoPage() {
    const [selectedBusiness, setSelectedBusiness] = useState('restaurant');
    const [customBusinessName, setCustomBusinessName] = useState('Mario\'s Italian Restaurant');

    const getBusinessName = (type) => {
        const names = {
            restaurant: 'Mario\'s Italian Restaurant',
            salon: 'Bella Hair Salon',
            auto_repair: 'Mike\'s Auto Repair',
            default: 'Your Business'
        };
        return names[type] || 'Your Business';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">AI Customer Assistant Demo</h1>
                    <p className="mt-2 text-gray-600">See how an AI chatbot would work for different types of businesses</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Business Type</h2>
                            <div className="space-y-3">
                                {businessTypes.map((type) => (
                                    <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value={type.id}
                                            checked={selectedBusiness === type.id}
                                            onChange={(e) => {
                                                setSelectedBusiness(e.target.value);
                                                setCustomBusinessName(getBusinessName(e.target.value));
                                            }}
                                            className="H-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{type.name}</div>
                                            <div className="text-sm text-gray-500">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                id="businessName"
                                value={customBusinessName}
                                onChange={(e) => setCustomBusinessName(e.target.value)}
                                className="W-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">Try asking:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                {selectedBusiness === 'restaurant' && (
                                    <>
                                        <li>• &quot;What time do you close?&quot;</li>
                                        <li>• &quot;Can I make a reservation for tonight?&quot;</li>
                                        <li>• &quot;What&apos;s your most popular dish?&quot;</li>
                                    </>
                                )}
                                {selectedBusiness === 'salon' && (
                                    <>
                                        <li>• &quot;How much is a haircut?&quot;</li>
                                        <li>• &quot;Can I book an appointment?&quot;</li>
                                        <li>• &quot;What services do you offer?&quot;</li>
                                    </>
                                )}
                                {selectedBusiness === 'auto_repair' && (
                                    <>
                                        <li>• &quot;Do you do brake repairs?&quot;</li>
                                        <li>• &quot;How much for an oil change?&quot;</li>
                                        <li>• &quot;Can you look at my check engine light?&quot;</li>
                                    </>
                                )}
                                {selectedBusiness === 'default' && (
                                    <>
                                        <li>• &quot;What are your hours?&quot;</li>
                                        <li>• &quot;Where are you located?&quot;</li>
                                        <li>• &quot;How can I contact you?&quot;</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-green-900 mb-2">What This Does for You:</h3>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>✅ Answers customer questions 24/7</li>
                                <li>✅ Collects customer contact information</li>
                                <li>✅ Reduces phone interruptions</li>
                                <li>✅ Professional appearance on your website</li>
                                <li>✅ Works on mobile and desktop</li>
                            </ul>
                        </div>
                    </div>

                    {/* Chat Demo */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Demo</h2>
                        <ChatWidget
                            businessType={selectedBusiness}
                            businessName={customBusinessName}
                            isOpen={true}
                        />

                        <div className="mt-6 text-center">
                            <div className="text-sm text-gray-500 mb-4">
                                This chatbot would appear on your website as a small button in the corner
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg font-semibold text-green-600">Setup: $500</div>
                                <div className="text-sm text-gray-600">Includes custom training for your business</div>
                                <div className="text-lg font-semibold text-blue-600">Monthly: $50</div>
                                <div className="text-sm text-gray-600">Hosting, updates, and support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}