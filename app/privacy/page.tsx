// app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: October 19, 2025</p>

                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            This Privacy Notice for WidgetWise LLC (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your personal information when you use our services (&quot;<strong>Services</strong>&quot;), including when you:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
                            <li>
                                Visit our website at{' '}
                                <Link href="https://www.aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                    https://www.aiwidgetwise.com
                                </Link>
                                {' '}or any website of ours that links to this Privacy Notice
                            </li>
                            <li>
                                Use WidgetWise AI Agent. Our service provides an AI-powered customer engagement agent that can be embedded on business websites. The agent uses artificial intelligence to: Answer visitor questions in real-time 24/7. Capture and qualify leads automatically. Provide intelligent responses about your business, products, and services. Collect contact information from interested visitors.
                            </li>
                            <li>
                                Engage with us in other related ways, including any sales, marketing, or events
                            </li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>.
                        </p>
                    </div>

                    {/* Summary of Key Points */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary of Key Points</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our{' '}
                            <a href="#toc" className="text-blue-600 hover:text-blue-700 underline">table of contents</a> below to find the section you are looking for.
                        </p>

                        <div className="space-y-4 text-gray-700">
                            <p>
                                <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about{' '}
                                <a href="#personalinfo" className="text-blue-600 hover:text-blue-700 underline">personal information you disclose to us</a>.
                            </p>

                            <p>
                                <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
                            </p>

                            <p>
                                <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
                            </p>

                            <p>
                                <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about{' '}
                                <a href="#infouse" className="text-blue-600 hover:text-blue-700 underline">how we process your information</a>.
                            </p>

                            <p>
                                <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn more about{' '}
                                <a href="#whoshare" className="text-blue-600 hover:text-blue-700 underline">when and with whom we share your personal information</a>.
                            </p>

                            <p>
                                <strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about{' '}
                                <a href="#infosafe" className="text-blue-600 hover:text-blue-700 underline">how we keep your information safe</a>.
                            </p>

                            <p>
                                <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about{' '}
                                <a href="#privacyrights" className="text-blue-600 hover:text-blue-700 underline">your privacy rights</a>.
                            </p>

                            <p>
                                <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by visiting{' '}
                                <Link href="https://aiwidgetwise.com/contact" className="text-blue-600 hover:text-blue-700 underline">
                                    https://aiwidgetwise.com/contact
                                </Link>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
                            </p>
                        </div>
                    </section>

                    {/* Table of Contents */}
                    <section id="toc" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
                        <ol className="list-decimal pl-6 space-y-2 text-blue-600">
                            <li><a href="#infocollect" className="hover:text-blue-700 underline">What Information Do We Collect?</a></li>
                            <li><a href="#infouse" className="hover:text-blue-700 underline">How Do We Process Your Information?</a></li>
                            <li><a href="#whoshare" className="hover:text-blue-700 underline">When and With Whom Do We Share Your Personal Information?</a></li>
                            <li><a href="#cookies" className="hover:text-blue-700 underline">Do We Use Cookies and Other Tracking Technologies?</a></li>
                            <li><a href="#ai" className="hover:text-blue-700 underline">Do We Offer Artificial Intelligence-Based Products?</a></li>
                            <li><a href="#inforetain" className="hover:text-blue-700 underline">How Long Do We Keep Your Information?</a></li>
                            <li><a href="#infosafe" className="hover:text-blue-700 underline">How Do We Keep Your Information Safe?</a></li>
                            <li><a href="#infominors" className="hover:text-blue-700 underline">Do We Collect Information From Minors?</a></li>
                            <li><a href="#privacyrights" className="hover:text-blue-700 underline">What Are Your Privacy Rights?</a></li>
                            <li><a href="#DNT" className="hover:text-blue-700 underline">Controls for Do-Not-Track Features</a></li>
                            <li><a href="#uslaws" className="hover:text-blue-700 underline">Do United States Residents Have Specific Privacy Rights?</a></li>
                            <li><a href="#policyupdates" className="hover:text-blue-700 underline">Do We Make Updates to This Notice?</a></li>
                            <li><a href="#contact" className="hover:text-blue-700 underline">How Can You Contact Us About This Notice?</a></li>
                            <li><a href="#request" className="hover:text-blue-700 underline">How Can You Review, Update, or Delete the Data We Collect From You?</a></li>
                        </ol>
                    </section>

                    {/* 1. What Information Do We Collect */}
                    <section id="infocollect" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Information Do We Collect?</h2>

                        <h3 id="personalinfo" className="text-xl font-semibold text-gray-900 mb-3">Personal information you disclose to us</h3>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We collect personal information that you provide to us.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-2">
                            <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li>names</li>
                            <li>phone numbers</li>
                            <li>email addresses</li>
                            <li>contact preferences</li>
                            <li>passwords</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Sensitive Information.</strong> We do not process sensitive information.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Payment Data.</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Stripe. You may find their privacy notice link(s) here:{' '}
                            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                https://stripe.com/privacy
                            </a>.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Information automatically collected</h3>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Like many businesses, we also collect information through cookies and similar technologies. You can find out more about this in our Cookie Notice:{' '}
                            <Link href="https://aiwidgetwise.com/cookies" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/cookies
                            </Link>.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-2">The information we collect includes:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>
                                <strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called &quot;crash dumps&quot;), and hardware settings).
                            </li>
                            <li>
                                <strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.
                            </li>
                            <li>
                                <strong>Location Data.</strong> We collect location data such as information about your device&apos;s location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
                            </li>
                        </ul>
                    </section>

                    {/* 2. How Do We Process Your Information */}
                    <section id="infouse" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How Do We Process Your Information?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-3">
                            <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                            <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                            <li><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                            <li><strong>To send administrative information to you.</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
                            <li><strong>To fulfill and manage your orders.</strong> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
                            <li><strong>To enable user-to-user communications.</strong> We may process your information if you choose to use any of our offerings that allow for communication with another user.</li>
                            <li><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                            <li><strong>To send you marketing and promotional communications.</strong> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time.</li>
                            <li><strong>To post testimonials.</strong> We post testimonials on our Services that may contain personal information.</li>
                            <li><strong>To protect our Services.</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
                            <li><strong>To evaluate and improve our Services, products, marketing, and your experience.</strong> We may process your information when we believe it is necessary to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services, products, marketing, and your experience.</li>
                            <li><strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                            <li><strong>To comply with our legal obligations.</strong> We may process your information to comply with our legal obligations, respond to legal requests, and exercise, establish, or defend our legal rights.</li>
                            <li><strong>To train and customize AI agents for individual client accounts.</strong> We process business information and configuration data provided by our clients to create customized AI agents that can accurately respond to questions about their specific business, services, and products.</li>
                            <li><strong>To provide analytics and insights to our business clients about their customer interactions.</strong> We analyze chat conversations, visitor behavior patterns, and lead quality metrics to help our clients understand their customers better and improve their service delivery.</li>
                            <li><strong>To connect website visitors with our business clients through lead capture.</strong> When visitors provide contact information during chat conversations, we collect and forward this information to the relevant business client for follow-up and service fulfillment.</li>
                            <li><strong>To process and respond to chat conversations using AI.</strong> We use artificial intelligence technology, including OpenAI&apos;s language models, to understand visitor questions and generate appropriate responses based on the client&apos;s business context and training data.</li>
                            <li><strong>To maintain and improve AI response quality.</strong> We may review chat conversations to identify areas where AI responses can be improved, ensuring accurate and helpful interactions for website visitors.</li>
                            <li><strong>To prevent abuse and ensure service security.</strong> We monitor usage patterns and chat content to detect and prevent malicious use, spam, or attempts to compromise our service or our clients&apos; websites.</li>
                            <li><strong>To provide technical support to our clients.</strong> We may access account data and chat logs when necessary to troubleshoot issues, answer client questions, and ensure proper service functionality.</li>
                        </ul>
                    </section>

                    {/* 3. When and With Whom */}
                    <section id="whoshare" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. When and With Whom Do We Share Your Personal Information?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-3">
                            We may need to share your personal information in the following situations:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                            <li><strong>Business Partners.</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
                        </ul>
                    </section>

                    {/* 4. Cookies */}
                    <section id="cookies" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Do We Use Cookies and Other Tracking Technologies?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            To the extent these online tracking technologies are deemed to be a &quot;sale&quot;/&quot;sharing&quot; (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section &quot;Do United States Residents Have Specific Privacy Rights?&quot;
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice:{' '}
                            <Link href="https://aiwidgetwise.com/cookies" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/cookies
                            </Link>.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Google Analytics</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may share your information with Google Analytics to track and analyze the use of the Services. To opt out of being tracked by Google Analytics across the Services, visit{' '}
                            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                https://tools.google.com/dlpage/gaoptout
                            </a>. For more information on the privacy practices of Google, please visit the{' '}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                Google Privacy & Terms page
                            </a>.
                        </p>
                    </section>

                    {/* 5. AI Products */}
                    <section id="ai" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Do We Offer Artificial Intelligence-Based Products?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, &quot;AI Products&quot;). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Use of AI Technologies</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We provide the AI Products through third-party service providers (&quot;AI Service Providers&quot;), including OpenAI. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products for purposes outlined in &quot;When and With Whom Do We Share Your Personal Information?&quot; You must not use the AI Products in any way that violates the terms or policies of any AI Service Provider.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Our AI Products</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">Our AI Products are designed for the following functions:</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li>AI bots</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Process Your Data Using AI</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            All personal information processed using our AI Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data&apos;s safety.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Opt Out</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">We believe in giving you the power to decide how your data is used. To opt out, you can:</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                            <li>
                                Contact us at{' '}
                                <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                    support@aiwidgetwise.com
                                </a>
                                {' '}with your request
                            </li>
                        </ul>
                    </section>

                    {/* 6. How Long */}
                    <section id="inforetain" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. How Long Do We Keep Your Information?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than twelve (12) months past the termination of the user&apos;s account.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                        </p>
                    </section>

                    {/* 7. How Do We Keep Info Safe */}
                    <section id="infosafe" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. How Do We Keep Your Information Safe?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
                        </p>
                    </section>

                    {/* 8. Do We Collect Info From Minors */}
                    <section id="infominors" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Do We Collect Information From Minors?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>.
                        </p>
                    </section>

                    {/* 9. What Are Your Privacy Rights */}
                    <section id="privacyrights" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. What Are Your Privacy Rights?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
                        </p>

                        <h3 id="withdrawconsent" className="text-xl font-semibold text-gray-900 mb-3">Withdrawing your consent</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section &quot;<a href="#contact" className="text-blue-600 hover:text-blue-700 underline">How Can You Contact Us About This Notice?</a>&quot; below.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Opting out of marketing and promotional communications</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section &quot;<a href="#contact" className="text-blue-600 hover:text-blue-700 underline">How Can You Contact Us About This Notice?</a>&quot; below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            If you would at any time like to review or change the information in your account or terminate your account, you can:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li>Log in to your account settings and update your user account.</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and similar technologies</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. For further information, please see our Cookie Notice:{' '}
                            <Link href="https://aiwidgetwise.com/cookies" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/cookies
                            </Link>.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            If you have questions or comments about your privacy rights, you may email us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>.
                        </p>
                    </section>

                    {/* 10. Do Not Track */}
                    <section id="DNT" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Controls for Do-Not-Track Features</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.
                        </p>
                    </section>

                    {/* 11. US State Privacy Rights */}
                    <section id="uslaws" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Do United States Residents Have Specific Privacy Rights?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Categories of Personal Information We Collect</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section &quot;<a href="#infocollect" className="text-blue-600 hover:text-blue-700 underline">What Information Do We Collect?</a>&quot;
                        </p>

                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Category</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Examples</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Collected</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">A. Identifiers</td>
                                        <td className="border border-gray-300 px-4 py-2">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">B. Personal information as defined in the California Customer Records statute</td>
                                        <td className="border border-gray-300 px-4 py-2">Name, contact information, education, employment, employment history, and financial information</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">C. Protected classification characteristics under state or federal law</td>
                                        <td className="border border-gray-300 px-4 py-2">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">D. Commercial information</td>
                                        <td className="border border-gray-300 px-4 py-2">Transaction information, purchase history, financial details, and payment information</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">E. Biometric information</td>
                                        <td className="border border-gray-300 px-4 py-2">Fingerprints and voiceprints</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">F. Internet or other similar network activity</td>
                                        <td className="border border-gray-300 px-4 py-2">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">G. Geolocation data</td>
                                        <td className="border border-gray-300 px-4 py-2">Device location</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">H. Audio, electronic, sensory, or similar information</td>
                                        <td className="border border-gray-300 px-4 py-2">Images and audio, video or call recordings created in connection with our business activities</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">I. Professional or employment-related information</td>
                                        <td className="border border-gray-300 px-4 py-2">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">J. Education Information</td>
                                        <td className="border border-gray-300 px-4 py-2">Student records and directory information</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">K. Inferences drawn from collected personal information</td>
                                        <td className="border border-gray-300 px-4 py-2">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual&apos;s preferences and characteristics</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">L. Sensitive personal Information</td>
                                        <td className="border border-gray-300 px-4 py-2"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-2">
                            We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li>Receiving help through our customer support channels;</li>
                            <li>Participation in customer surveys or contests; and</li>
                            <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Sources of Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Learn more about the sources of personal information we collect in &quot;<a href="#infocollect" className="text-blue-600 hover:text-blue-700 underline">What Information Do We Collect?</a>&quot;
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use and Share Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Learn more about how we use your personal information in the section, &quot;<a href="#infouse" className="text-blue-600 hover:text-blue-700 underline">How Do We Process Your Information?</a>&quot;
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Will your information be shared with anyone else?</strong>
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, &quot;<a href="#whoshare" className="text-blue-600 hover:text-blue-700 underline">When and With Whom Do We Share Your Personal Information?</a>&quot;
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be &quot;selling&quot; of your personal information.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li><strong>Right to know</strong> whether or not we are processing your personal data</li>
                            <li><strong>Right to access</strong> your personal data</li>
                            <li><strong>Right to correct</strong> inaccuracies in your personal data</li>
                            <li><strong>Right to request</strong> the deletion of your personal data</li>
                            <li><strong>Right to obtain a copy</strong> of the personal data you previously shared with us</li>
                            <li><strong>Right to non-discrimination</strong> for exercising your rights</li>
                            <li><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California&apos;s privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mb-2">
                            Depending upon the state where you live, you may also have the following rights:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                            <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
                            <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
                            <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
                            <li>Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)</li>
                            <li>Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)</li>
                            <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
                            <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To exercise these rights, you can contact us by visiting{' '}
                            <Link href="https://aiwidgetwise.com/contact" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/contact
                            </Link>, by emailing us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>, by visiting{' '}
                            <Link href="https://aiwidgetwise.com/contact" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/contact
                            </Link>, or by referring to the contact details at the bottom of this document.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Request Verification</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Appeals</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">California &quot;Shine The Light&quot; Law</h3>
                        <p className="text-gray-700 leading-relaxed">
                            California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section &quot;<a href="#contact" className="text-blue-600 hover:text-blue-700 underline">How Can You Contact Us About This Notice?</a>&quot;
                        </p>
                    </section>

                    {/* 12. Do We Make Updates */}
                    <section id="policyupdates" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Do We Make Updates to This Notice?</h2>
                        <p className="text-gray-700 leading-relaxed italic mb-4">
                            <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
                        </p>
                    </section>

                    {/* 13. How Can You Contact Us */}
                    <section id="contact" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. How Can You Contact Us About This Notice?</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have questions or comments about this notice, you may email us at{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                support@aiwidgetwise.com
                            </a>{' '}
                            or contact us by post at:
                        </p>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-gray-900">WidgetWise, LLC</p>
                            <p className="text-gray-700 mt-2">613 NW 3rd Ave.</p>
                            <p className="text-gray-700">428</p>
                            <p className="text-gray-700">Fort Lauderdale, FL 33311</p>
                            <p className="text-gray-700">United States</p>
                        </div>
                    </section>

                    {/* 14. How Can You Review/Update/Delete */}
                    <section id="request" className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. How Can You Review, Update, or Delete the Data We Collect From You?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please visit:{' '}
                            <Link href="https://aiwidgetwise.com/contact" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com/contact
                            </Link>.
                        </p>
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
                        <Link href="/privacy" className="hover:text-gray-900 font-medium">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-gray-900">Cookie Policy</Link>
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