
export function LeadGenerationInsight() {
    return (
        <section id="insights" className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl leading-tight text-black font-sans font-light">Lead Generation</h1>

                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                            Every visitor is a potential customer. Instant response wins more business. AI agents engage every visitor immediately, 24/7, converting more leads than traditional chatbots.
                        </p>
                        <div className="mt-12 max-w-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

                                <div className="py-4">
                                    <div className="text-3xl font-bold text-gray-900">78%</div>
                                    <div className="text-sm text-gray-600 mt-1">of sales go to the first responder. <span className="citation-icon"
                                                                                                                                      data-tooltip="Source: HubSpot Research 2024">ⓘ</span></div>
                                </div>

                                <div className="py-4 md:border-l md:border-r border-gray-200">
                                    <div className="text-3xl font-bold text-gray-900">82%</div>
                                    <div className="text-sm text-gray-600 mt-1">of consumers expect responses within 10 minutes.</div>
                                </div>

                                <div className="py-4">
                                    <div className="text-3xl font-bold text-gray-900">4x</div>
                                    <div className="text-sm text-gray-600 mt-1">more conversions with 1-minute response.</div>
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
                                    The first company to respond typically wins the business. With 35% of inquiries arriving after hours, being available 24/7 becomes a competitive advantage.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2.5 mr-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Most website visitors expect quick responses, even outside business hours. When the average response time is 47 hours, there&apos;s a significant gap between customer expectations and reality.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2.5 mr-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Response time directly impacts conversion rates. Companies responding to inquiries within one minute see nearly 4x more conversions than those taking just 30 minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}