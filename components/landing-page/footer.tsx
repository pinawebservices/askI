import { Zap, Twitter, Linkedin, Github } from "lucide-react"

export function FinFooter() {
    return (
        <footer className="bg-foreground text-background">
            <div className="w-full px-8 md:px-16 py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 text-center max-w-7xl mx-auto">
                    <div className="lg:col-span-1">
                        {/*<div className="flex items-center space-x-2">*/}
                        {/*    <Zap className="h-6 w-6" />*/}
                        {/*    <span className="text-xl font-bold">StreamLine</span>*/}
                        {/*</div>*/}
                        <div className="flex items-center gap-2 justify-center">
                            <div className="text-white text-2xl font-bold">
                                <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                                    <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                    <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                    <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                </svg>
                            </div>
                            <span className="text-white text-xl font-semibold">AIWidgetWise</span>
                        </div>
                        <p className="mt-4 text-sm text-background/70">
                            Transform your workflow and amplify your productivity with our powerful automation platform.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Product</h3>
                        <ul className="mt-4 space-y-2 text-sm text-background/70">
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Integrations
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    API
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm text-background/70">
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm text-background/70">
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Status
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-background transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-background/20 pt-8">
                    <p className="text-center text-sm text-background/70">© 2024 StreamLine. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
