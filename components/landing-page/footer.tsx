import { Zap, Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-foreground text-background">
            <div className="container py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-6 w-6" />
                            <span className="text-xl font-bold">StreamLine</span>
                        </div>
                        <p className="mt-4 text-sm text-background/70">
                            Transform your workflow and amplify your productivity with our powerful automation platform.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Twitter className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
                            <Github className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
                        </div>
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
