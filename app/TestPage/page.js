import Link from "next/link"

export default function Home() {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            {/*<div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-300 text-white overflow-hidden">*/}
            <div className="relative min-h-screen bg-gradient-to-br bg-cover bg-center bg-no-repeat" style={{backgroundImage: "chatbot-bg.png"}}>
                {/* Flowing Curved Background Shapes */}
                <div className="absolute inset-0">
                    {/* Large flowing curve 1 */}
                    <div className="absolute -top-20 -left-40 w-[800px] h-[600px] bg-gradient-to-br from-blue-400/40 to-transparent rounded-full transform rotate-12 blur-sm"></div>

                    {/* Large flowing curve 2 */}
                    <div className="absolute top-0 left-1/4 w-[900px] h-[700px] bg-gradient-to-bl from-cyan-300/30 to-transparent rounded-full transform -rotate-6 blur-sm"></div>

                    {/* Large flowing curve 3 */}
                    <div className="absolute top-1/4 -right-40 w-[1000px] h-[800px] bg-gradient-to-tl from-emerald-300/35 to-transparent rounded-full transform rotate-3 blur-sm"></div>

                    {/* Large flowing curve 4 */}
                    <div className="absolute -bottom-40 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-teal-300/40 to-transparent rounded-full transform -rotate-12 blur-sm"></div>

                    {/* Large flowing curve 5 */}
                    <div className="absolute bottom-0 right-1/3 w-[600px] h-[400px] bg-gradient-to-tl from-cyan-400/30 to-transparent rounded-full transform rotate-45 blur-sm"></div>

                    {/* Additional layered curves for depth */}
                    <div className="absolute top-1/3 left-1/3 w-[500px] h-[350px] bg-gradient-to-r from-blue-300/20 to-cyan-300/15 rounded-full transform rotate-30 blur-lg"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-gradient-to-l from-emerald-300/25 to-teal-300/20 rounded-full transform -rotate-20 blur-lg"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex items-center min-h-screen">
                    <div className="text-center w-full">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Stop Missing Customers
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
                            AI-powered customer service that works 24/7, answers questions, and captures leads while you focus on your
                            business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/demo"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                See Live Demo
                            </Link>
                            <a
                                href="#pricing"
                                className="inline-block border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                            >
                                View Pricing
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problem Section */}
            <div className="relative py-20 overflow-hidden">
                {/* Large flowing background shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <div className="absolute -top-20 -right-20 w-[400px] h-[300px] bg-gradient-to-bl from-red-100/40 to-orange-100/30 rounded-full transform rotate-12 blur-2xl"></div>
                    <div className="absolute top-1/2 -left-32 w-[350px] h-[250px] bg-gradient-to-tr from-red-50/50 to-orange-50/40 rounded-full transform -rotate-12 blur-3xl"></div>
                    <div className="absolute -bottom-16 right-1/4 w-[300px] h-[200px] bg-gradient-to-tl from-orange-100/35 to-red-100/25 rounded-full transform rotate-45 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                            How Many Customers Are You Losing?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 backdrop-blur-sm">
                            <div className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
                                67%
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                of customers hang up if they can&apos;t reach someone immediately
                            </p>
                        </div>
                        <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 backdrop-blur-sm">
                            <div className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
                                3am
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Your website gets visitors at all hours, but no one&apos;s there to help
                            </p>
                        </div>
                        <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 backdrop-blur-sm">
                            <div className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
                                15+
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                interruptions per day from the same basic questions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Solution Section */}
            <div className="relative py-20 overflow-hidden">
                {/* Large flowing background shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/30 to-emerald-50/30">
                    <div className="absolute -top-32 left-0 w-[500px] h-[350px] bg-gradient-to-br from-blue-100/40 to-cyan-100/30 rounded-full transform -rotate-12 blur-3xl"></div>
                    <div className="absolute top-1/4 -right-40 w-[600px] h-[400px] bg-gradient-to-bl from-cyan-100/35 to-emerald-100/25 rounded-full transform rotate-12 blur-2xl"></div>
                    <div className="absolute -bottom-20 left-1/3 w-[400px] h-[300px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/30 rounded-full transform rotate-45 blur-3xl"></div>
                    <div className="absolute bottom-1/4 -left-20 w-[350px] h-[250px] bg-gradient-to-tl from-teal-100/35 to-blue-100/25 rounded-full transform -rotate-45 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Your AI Assistant Works While You Sleep
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Instantly answer customer questions, book appointments, and collect contact information 24/7
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">24/7 Availability</h3>
                            <p className="text-gray-600 leading-relaxed">Never miss a customer, even when you&apos;re closed</p>
                        </div>
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100 group">
                            <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Instant Answers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Responds immediately to common questions about hours, services, pricing
                            </p>
                        </div>
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group">
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Lead Capture</h3>
                            <p className="text-gray-600 leading-relaxed">Collects customer contact info for follow-up and bookings</p>
                        </div>
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Custom Trained</h3>
                            <p className="text-gray-600 leading-relaxed">Knows your business details, services, and policies</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="relative py-20 overflow-hidden">
                {/* Large flowing background shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50">
                    <div className="absolute -top-40 -left-32 w-[550px] h-[400px] bg-gradient-to-br from-blue-200/30 to-cyan-200/20 rounded-full transform rotate-12 blur-3xl"></div>
                    <div className="absolute top-1/3 -right-40 w-[600px] h-[450px] bg-gradient-to-bl from-cyan-200/25 to-emerald-200/15 rounded-full transform -rotate-12 blur-2xl"></div>
                    <div className="absolute -bottom-32 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-emerald-200/30 to-teal-200/20 rounded-full transform rotate-45 blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-teal-200/25 to-blue-200/15 rounded-full transform -rotate-45 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            One-time setup + low monthly hosting. No contracts, cancel anytime.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm border-2 border-transparent bg-gradient-to-br from-blue-100 to-teal-100 p-1 rounded-2xl shadow-2xl">
                            <div className="bg-white rounded-xl p-10 text-center">
                                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold rounded-full mb-6">
                                    Most Popular
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete AI Assistant</h3>

                                <div className="mb-8">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                        $500
                                    </div>
                                    <div className="text-gray-600 text-lg">One-time setup</div>
                                </div>

                                <div className="mb-10">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">$50</div>
                                    <div className="text-gray-600 text-lg">per month</div>
                                </div>

                                <div className="space-y-4 mb-10 text-left">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Custom AI trained for your business</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Easy website integration (2 lines of code)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">24/7 customer support</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Lead capture and contact collection</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Mobile and desktop responsive</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Updates and improvements included</span>
                                    </div>
                                </div>

                                <Link
                                    href="/demo"
                                    className="block w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Try Live Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 text-white py-20 overflow-hidden">
                {/* Large flowing background shapes */}
                <div className="absolute inset-0">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[350px] bg-gradient-to-bl from-blue-400/20 to-cyan-400/10 rounded-full transform rotate-12 blur-3xl"></div>
                    <div className="absolute top-1/3 -left-40 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-400/15 to-emerald-400/10 rounded-full transform -rotate-12 blur-2xl"></div>
                    <div className="absolute -bottom-20 right-1/4 w-[400px] h-[300px] bg-gradient-to-tl from-emerald-400/20 to-teal-400/15 rounded-full transform rotate-45 blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-0 w-[350px] h-[250px] bg-gradient-to-br from-teal-400/15 to-blue-400/10 rounded-full transform -rotate-45 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Ready to Stop Missing Customers?
                    </h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
                        See exactly how an AI assistant would work for your business
                    </p>
                    <Link
                        href="/demo"
                        className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        View Live Demo
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-600">
                        <p className="text-lg">&copy; 2025 AI Customer Assistant. Built for local businesses.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
