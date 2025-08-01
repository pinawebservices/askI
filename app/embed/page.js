// app/embed/page.js
'use client';

import { useState, useEffect } from 'react';

export default function EmbedPage() {
    const [businessName, setBusinessName] = useState('Mario\'s Italian Restaurant');
    const [businessType, setBusinessType] = useState('restaurant');
    const [customDetails, setCustomDetails] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#2563EB');
    const [customerId, setCustomerId] = useState('');
    const [baseUrl, setBaseUrl] = useState('http://localhost:3000');

    // Set the base URL after component mounts (client-side only)
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const generateEmbedCode = () => {
        return `<!-- AI Chatbot Widget -->
<script>
  window.aiChatbotConfig = {
    apiUrl: '${baseUrl}',
    businessType: '${businessType}',
    businessName: '${businessName}',
    customDetails: '${customDetails}',
    customerId: '${customerId}',
    theme: {
      primaryColor: '${primaryColor}',
      textColor: '#FFFFFF'
    }
  };
</script>
<script src="${baseUrl}/embed.js"></script>`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateEmbedCode());
        alert('Embed code copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">AI Chatbot Integration</h1>
                    <p className="mt-2 text-gray-600">Customize and generate your chatbot embed code</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Configuration Panel */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Chatbot Configuration</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your Business Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Type
                                </label>
                                <select
                                    id="businessType"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="salon">Hair Salon / Spa</option>
                                    <option value="auto_repair">Auto Repair</option>
                                    <option value="default">General Business</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand Color
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="color"
                                        id="primaryColor"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#2563EB"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="customDetails" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Business Details (Optional)
                                </label>
                                <textarea
                                    id="customDetails"
                                    value={customDetails}
                                    onChange={(e) => setCustomDetails(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Special hours, unique services, policies, etc."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Embed Code Panel */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Embed Code</h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Copy this code and paste it before the closing &lt;/body&gt; tag on your website:
                            </p>

                            <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-sm overflow-x-auto">
                  <code>{generateEmbedCode()}</code>
                </pre>
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">Installation Instructions:</h3>
                            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Copy the embed code above</li>
                                <li>Open your website&apos;s HTML file or content management system</li>
                                <li>Paste the code before the closing &lt;/body&gt; tag</li>
                                <li>Save and publish your website</li>
                                <li>The chat widget will appear in the bottom-right corner</li>
                            </ol>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-medium text-green-900 mb-2">✅ Features Included:</h3>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• 24/7 automated responses</li>
                                    <li>• Lead capture and contact collection</li>
                                    <li>• Mobile-responsive design</li>
                                    <li>• Custom branding with your colors</li>
                                    <li>• Industry-specific knowledge</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="font-medium text-yellow-900 mb-2">⚡ Need Help?</h3>
                                <p className="text-sm text-yellow-800">
                                    If you need assistance with installation, we offer free setup service.
                                    Contact us and we&apos;ll install it for you within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
                    <div className="bg-gray-100 rounded-lg p-8 min-h-64 relative">
                        <p className="text-gray-600 text-center">
                            This is how your website will look with the chatbot widget installed.
                        </p>
                        <p className="text-gray-500 text-center text-sm mt-2">
                            The chat button will appear in the bottom-right corner.
                        </p>

                        {/* Mock chat button */}
                        <div
                            className="absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.804-.9L3 21l1.9-6.196A8.955 8.955 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}