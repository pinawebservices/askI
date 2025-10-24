// app/cookies/page.tsx
import Link from 'next/link';

export default function CookiePolicyPage() {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: October 19, 2025</p>

                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            This Cookie Policy explains how WidgetWise, LLC (&quot;<strong>Company</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; and &quot;<strong>our</strong>&quot;) uses cookies and similar technologies to recognize you when you visit our website at{' '}
                            <Link href="https://aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                https://aiwidgetwise.com
                            </Link>
                            {' '}(&quot;<strong>Website</strong>&quot;). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
                        </p>
                    </div>

                    {/* What are cookies? */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">What are cookies?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Cookies set by the website owner (in this case, WidgetWise) are called &quot;first-party cookies.&quot; Cookies set by parties other than the website owner are called &quot;third-party cookies.&quot; Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                        </p>
                    </section>

                    {/* Why do we use cookies? */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why do we use cookies?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
                        </p>
                    </section>

                    {/* How can I control cookies? */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How can I control cookies?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The Cookie Consent Manager can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The specific types of first- and third-party cookies served through our Website and the purposes they perform are described below (please note that the specific cookies served may vary depending on the specific Online Properties you visit).
                        </p>
                    </section>

                    {/* How can I control cookies on my browser? */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How can I control cookies on my browser?</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser&apos;s help menu for more information. The following is information about how to manage cookies on the most popular browsers:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>
                                <a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Chrome
                                </a>
                            </li>
                            <li>
                                <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Internet Explorer
                                </a>
                            </li>
                            <li>
                                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Firefox
                                </a>
                            </li>
                            <li>
                                <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Safari
                                </a>
                            </li>
                            <li>
                                <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Edge
                                </a>
                            </li>
                            <li>
                                <a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Opera
                                </a>
                            </li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                            <li>
                                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Digital Advertising Alliance
                                </a>
                            </li>
                            <li>
                                <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    Digital Advertising Alliance of Canada
                                </a>
                            </li>
                            <li>
                                <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                    European Interactive Digital Advertising Alliance
                                </a>
                            </li>
                        </ul>
                    </section>

                    {/* What about other tracking technologies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">What about other tracking technologies, like web beacons?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called &quot;tracking pixels&quot; or &quot;clear gifs&quot;). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
                        </p>
                    </section>

                    {/* Flash cookies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Do you use Flash cookies or Local Shared Objects?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Websites may also use so-called &quot;Flash Cookies&quot; (also known as Local Shared Objects or &quot;LSOs&quot;) to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the{' '}
                            <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                Website Storage Settings Panel
                            </a>
                            . You can also control Flash Cookies by going to the{' '}
                            <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                Global Storage Settings Panel
                            </a>
                            {' '}and following the instructions.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications, including, potentially, Flash applications used in connection with our services or online content.
                        </p>
                    </section>

                    {/* Targeted advertising */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Do you serve targeted advertising?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.
                        </p>
                    </section>

                    {/* Updates */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How often will you update this Cookie Policy?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The date at the top of this Cookie Policy indicates when it was last updated.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Where can I get further information?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about our use of cookies or other technologies, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-gray-900">WidgetWise, LLC</p>
                            <p className="text-gray-700 mt-2">
                                Email:{' '}
                                <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-700 underline">
                                    support@aiwidgetwise.com
                                </a>
                            </p>
                            <p className="text-gray-700 mt-1">
                                Contact Form:{' '}
                                <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                                    Contact Us
                                </Link>
                            </p>
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
                        <Link href="/cookies" className="hover:text-gray-900 font-medium">Cookie Policy</Link>
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