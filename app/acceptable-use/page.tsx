// app/acceptable-use/page.tsx
import Link from 'next/link';

export default function AcceptableUsePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header - matches your landing page */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                            <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                            <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                            <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                        </svg>
                        <span className="text-xl font-semibold">WidgetWise</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="prose prose-lg max-w-none">
                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Acceptable Use Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: October 20, 2025</p>

                    {/* Introduction */}
                    <section className="mb-8">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            This Acceptable Use Policy (&quot;<strong>Policy</strong>&quot;) is part of our Terms and Conditions (&quot;<strong>Legal Terms</strong>&quot;) and should therefore be read alongside our main Legal Terms: <a href="https://aiwidgetwise.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">https://aiwidgetwise.com/terms</a>. When you use the AI-powered services provided by WIDGETWISE LLC (&quot;<strong>AI Products</strong>&quot;), you warrant that you will comply with this document, our Legal Terms and all applicable laws and regulations governing AI. Your usage of our AI Products signifies your agreement to engage with our platform in a lawful, ethical, and responsible manner that respects the rights and dignity of all individuals. If you do not agree with these Legal Terms, please refrain from using our Services. Your continued use of our Services implies acceptance of these Legal Terms.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Please carefully review this Policy which applies to any and all:
                        </p>

                        <div className="ml-5 mb-4 space-y-2 text-gray-700">
                            <p>(a) uses of our Services (as defined in &quot;Legal Terms&quot;)</p>
                            <p>(b) forms, materials, consent tools, comments, post, and all other content available on the Services (&quot;<strong>Content</strong>&quot;)</p>
                            <p>(d) responsible implementation and management of AI Products within our Services</p>
                        </div>
                    </section>

                    {/* Who We Are */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who We Are</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We are WIDGETWISE LLC (&quot;<strong>Company</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;) a company registered in Florida, United States at 613 NW 3rd. Ave., 428, Fort Lauderdale, FL 33311. We operate the website <a href="https://aiwidgetwise.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">https://aiwidgetwise.com</a> (the &quot;<strong>Site</strong>&quot;), as well as any other related products and services that refer or link to this Policy (collectively, the &quot;<strong>Services</strong>&quot;).
                        </p>
                    </section>

                    {/* Use of the Services */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of the Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you use the Services, you warrant that you will comply with this Policy and with all applicable laws.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You also acknowledge that you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                            <li>Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</li>
                            <li>Engage in unauthorized framing of or linking to the Services.</li>
                            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                            <li>Make improper use of our Services, including our support services or submit false reports of abuse or misconduct.</li>
                            <li>Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                            <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or the Services connected.</li>
                            <li>Attempt to impersonate another user or person or use the username of another user.</li>
                            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
                            <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.</li>
                            <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</li>
                            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</li>
                            <li>Delete the copyright or other proprietary rights notice from any Content.</li>
                            <li>Copy or adapt the Services&apos; software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
                            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party&apos;s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</li>
                            <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (&quot;gifs&quot;), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as &quot;spyware&quot; or &quot;passive collection mechanisms&quot; or &quot;pcms&quot;).</li>
                            <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorized script or other software.</li>
                            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
                            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
                            <li>Use the Service to collect sensitive personal information (SSN, credit card numbers, health records) without proper authorization and security measures.</li>
                            <li>Create or distribute spam, phishing attempts, or deceptive content through the AI agent.</li>
                            <li>Attempt to manipulate, jailbreak, or prompt inject the AI system to bypass safety measures.</li>
                            <li>Use the Service to harass, threaten, or harm website visitors or other users.</li>
                            <li>Upload training data containing copyrighted material, confidential information, or illegal content.</li>
                            <li>Use bots, scripts, or automated tools to create fake conversations or inflate usage metrics.</li>
                            <li>Violate any third-party rights including intellectual property, privacy, or publicity rights.</li>
                            <li>Use the Service in any way that violates applicable laws or regulations.</li>
                            <li>Interfere with or disrupt the Service or servers/networks connected to the Service.</li>
                            <li>Attempt to gain unauthorized access to other accounts, computer systems, or networks.</li>
                        </ul>
                    </section>

                    {/* Subscriptions */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Subscriptions</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you subscribe to our Services, you understand, acknowledge, and agree that you may not, except if expressly permitted:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Engage in any use, including modification, copying, redistribution, publication, display, performance, or retransmission, of any portions of any Services, other than as expressly permitted by this Policy, without the prior written consent of WIDGETWISE LLC, which consent WIDGETWISE LLC may grant or refuse in its sole and absolute discretion.</li>
                            <li>Reconstruct or attempt to discover any source code or algorithms of the Services, or any portion thereof, by any means whatsoever.</li>
                            <li>Provide, or otherwise make available, the Services to any third party.</li>
                            <li>Intercept any data not intended for you.</li>
                            <li>Damage, reveal, or alter any user&apos;s data, or any other hardware, software, or information relating to another person or entity.</li>
                            <li>Exceed usage limits or attempt to circumvent subscription tier restrictions.</li>
                            <li>Use the Service to train competing AI models or services.</li>
                            <li>Configure the AI agent to provide medical, legal, or financial advice without proper disclaimers.</li>
                            <li>Input malicious prompts designed to break or manipulate the AI system (jailbreaking).</li>
                            <li>Use multiple trial accounts or payment methods to avoid subscription fees.</li>
                            <li>Scrape, harvest, or bulk export conversation data beyond normal usage.</li>
                            <li>Use the Service for illegal activities or to facilitate fraudulent business practices.</li>
                            <li>Impersonate another business or misrepresent authorization to act on behalf of an organization.</li>
                            <li>Share API keys, credentials, or authentication tokens with unauthorized parties.</li>
                            <li>Use automated tools to generate excessive API calls or create artificial usage.</li>
                        </ul>
                    </section>

                    {/* AI Products */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Products</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you use the AI Products provided by WIDGETWISE LLC, you warrant that you will not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Deploy AI techniques that utilize subliminal, manipulative, or deceptive methods designed to distort behavior and impair informed decision-making, particularly when such actions cause significant harm to individuals.</li>
                            <li>Exploit vulnerabilities related to age, disability, or socio-economic circumstances through AI in a way that distorts behavior or decision-making, especially if this results in significant harm to the individual.</li>
                            <li>Use AI systems for biometric categorization that infer sensitive attributes such as race, political opinions, trade union membership, religious or philosophical beliefs, sex life, or sexual orientation, except in limited cases, such as labeling or filtering lawfully acquired datasets, or specific law enforcement activities.</li>
                            <li>Implement AI-based social scoring systems that evaluate or classify individuals or groups based on their social behavior or personal traits in a manner that causes harm, discrimination, or unfair treatment.</li>
                            <li>Assess the risk of an individual committing criminal offenses based solely on profiling, personality traits, or other non-behavioral factors, except in narrowly defined circumstances where legal safeguards are in place.</li>
                            <li>Not compile facial recognition databases through untargeted scraping of facial images from the internet, social media, or CCTV footage, unless it is part of a legally compliant and narrowly defined purpose.</li>
                            <li>Use AI to infer emotions in sensitive environments such as workplaces, educational institutions, or any other context where such analysis could lead to discrimination, unfair treatment, or privacy violations.</li>
                            <li>Engage in real-time remote biometric identification in public places for law enforcement purposes, except in specific situations where there are strong legal justifications and oversight mechanisms.</li>
                        </ul>
                    </section>

                    {/* Artificial Intelligence */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Artificial Intelligence</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We recognize the significant impact AI can have on our users and society, and we are dedicated to ensuring that our AI Products are designed and operated in a manner that aligns with comprehensive ethical standards. We aim to use AI to enhance user experiences while upholding fairness, transparency, and accountability principles.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            This Policy applies to all AI-powered features, services, and systems in our Services. It governs the development, deployment, and use of AI technologies to protect users&apos; rights and maintain transparency in all AI operations. This Policy applies to all stakeholders, including employees, third-party vendors, and partners who contribute to or interact with our AI Products.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Enforcement</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Any misuse of our AI Products or failure to adhere to the standards outlined in this Policy will result in appropriate actions to ensure the integrity of our platform and the protection of our users. The specific consequences for misuse of AI may vary depending on the nature and severity of the violation and the user&apos;s history with our Services.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Violations may include, but are not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                            <li>Engaging the AI Products in ways that violate user privacy, manipulate data, disregard ethical guidelines, or are against AI Service Providers&apos; terms of use.</li>
                            <li>Deploying AI in a manner that introduces or causes bias, leading to unfair treatment of users or groups.</li>
                            <li>Improper handling, storage, or use of data by AI Products, leading to breaches of user trust and legal compliance.</li>
                            <li>Using AI in a way that compromises the privacy and security of our systems, data, or users.</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Depending on the violation, WIDGETWISE LLC may take one or more of the following actions:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                            <li><strong>Warnings:</strong> The responsible party may receive a formal warning and be required to cease violating practices.</li>
                            <li><strong>Temporary Suspension:</strong> In cases of repeated or more severe violations, the responsible individual&apos;s access to AI Products or certain features of our platform may be temporarily suspended while the issue is investigated.</li>
                            <li><strong>Termination of Access:</strong> Serious violations, particularly those that result in harm to users or breach privacy or other regulations, may lead to the permanent termination of access to our AI Products and Services.</li>
                            <li><strong>Legal Action:</strong> In cases where the misuse of AI leads to significant harm, data breaches, or legal violations, we may pursue legal action against the party responsible. This could include reporting the incident to law enforcement or regulatory bodies.</li>
                            <li><strong>Public Disclosure:</strong> For incidents that impact public trust or involve severe ethical breaches, we reserve the right to publicly disclose the violation and the actions taken in response to maintain transparency and accountability.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Commitment to Responsible AI</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In addition to the consequences outlined above, we are deeply committed to repairing any harm caused by the misuse of AI. This commitment is a testament to our dedication to our users and our responsibility as a company. We will correct biased outcomes and implement additional safeguards to prevent future violations.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            At WIDGETWISE LLC, we are committed to the ongoing refinement and enhancement of our Policy. As technology evolves and regulatory environments shift, we recognize the importance of keeping our policies up to date to ensure that they remain relevant, effective, and aligned with best practices in AI ethics. We will regularly review and update our Policy to reflect technological advancements and legal changes in local, national, and international regulations related to AI. Our Policy will be updated as needed to comply with new laws and guidelines, ensuring that our practices remain legally sound and socially responsible.
                        </p>
                    </section>

                    {/* Consequences of Breaching */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Consequences of Breaching This Policy</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The consequences for violating our Policy will vary depending on the severity of the breach and the user&apos;s history on the Services, by way of example:
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may, in some cases, give you a warning, however, if your breach is serious or if you continue to breach our Legal Terms and this Policy, we have the right to suspend or terminate your access to and use of our Services and, if applicable, disable your account. We may also notify law enforcement or issue legal proceedings against you when we believe that there is a genuine risk to an individual or a threat to public safety.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We exclude our liability for all action we may take in response to any of your breaches of this Policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Can You Contact Us About This Policy?</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any further questions or comments, you may contact us by:
                        </p>
                        <div className="space-y-2 text-gray-700">
                            <p>Email: <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">support@aiwidgetwise.com</a></p>
                            <p>Online contact form: <a href="https://aiwidgetwise.com/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">https://aiwidgetwise.com/contact</a></p>
                        </div>
                    </section>
                </article>

                {/* Back to home link */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                    <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 mt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                        <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-gray-900">Cookie Policy</Link>
                        <Link href="/acceptable-use" className="hover:text-gray-900 font-medium">Acceptable Use Policy</Link>
                        <Link href="/contact" className="hover:text-gray-900">Contact Us</Link>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        © 2025 WidgetWise, LLC. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}