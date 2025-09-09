export function SavingsInsight() {
    return (
        <section id="insights" className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl leading-tight text-black font-sans font-light">Savings</h1>

                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                            Every missed inquiry is lost revenue. Capture after-hours opportunities, automate routine questions, and reduce interaction costs  — turning visitors into valuable leads.
                        </p>
                        <div className="mt-12 max-w-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

                                <div className="py-4">
                                    <div className="text-3xl font-bold text-gray-900">35%</div>
                                    <div className="text-sm text-gray-600 mt-1">of inquiries arrive after hours.</div>
                                </div>

                                <div className="py-4 md:border-l md:border-r border-gray-200">
                                    <div className="text-3xl font-bold text-gray-900">79%</div>
                                    <div className="text-sm text-gray-600 mt-1">of routine questions handled automatically.</div>
                                </div>

                                <div className="py-4">
                                    <div className="text-3xl font-bold text-gray-900">95%</div>
                                    <div className="text-sm text-gray-600 mt-1">cost reduction per customer interaction.</div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="lg:pl-12">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Insights</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2.5 mr-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Every night and weekend costs you money. With 35% of inquiries arriving when you&apos;re closed, you&apos;re missing valuable opportunities while still paying for the marketing that brought them to your site.                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2.5 mr-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    The majority of customer inquiries are repetitive and predictable. When 79% of routine questions can be handled by AI, your team focuses on complex, high-value interactions that actually require human expertise.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2.5 mr-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    AI chatbots handle customer inquiries at a fraction of the cost. Each automated interaction costs $0.50 compared to $6.00 for human support, reducing service costs by over 90%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}