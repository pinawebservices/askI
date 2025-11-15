'use client';

import { Check, Star, ArrowRight, Menu, X, MessageCircle, Shield, Users, Smartphone, BarChart3, Clock, Brain, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useState } from "react";

export default function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        {
            icon: <Brain className="h-6 w-6" />,
            title: "Intelligent Conversations",
            description: "Advanced AI that understands context and provides human-like responses to engage your visitors naturally.",
            bgColor: "bg-chart-1"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Lead Qualification",
            description: "Automatically qualify leads by asking the right questions and capturing valuable customer information.",
            bgColor: "bg-chart-2"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "24/7 Availability",
            description: "Never miss a potential customer. Your AI assistant works around the clock to capture leads and answer questions.",
            bgColor: "bg-chart-3"
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Easy Integration",
            description: "Get up and running in minutes with our simple embed code. Works with any website platform or CMS.",
            bgColor: "bg-chart-4"
        },
        {
            icon: <Smartphone className="h-6 w-6" />,
            title: "Multi-Language Support",
            description: "Communicate with customers in over 50 languages to expand your global reach and capture international leads.",
            bgColor: "bg-chart-5"
        },
        {
            icon: <BarChart3 className="h-6 w-6" />,
            title: "Analytics & Insights",
            description: "Track conversation metrics, lead quality, and conversion rates with detailed analytics and reporting.",
            bgColor: "bg-chart-1"
        }
    ];

    const testimonials = [
        {
            name: "Jessica Martinez",
            role: "Marketing Director at GrowthCorp",
            content: "Our lead generation increased by 300% after implementing ChatAssist. The AI conversations feel so natural that customers don't even realize they're talking to a bot.",
            rating: 5,
            accent: "border-l-chart-1"
        },
        {
            name: "David Chen",
            role: "Head of Sales at TechSolutions",
            content: "The lead qualification feature is a game-changer. We now get pre-qualified leads instead of random inquiries, making our sales team much more efficient.",
            rating: 5,
            accent: "border-l-chart-2"
        },
        {
            name: "Amanda Thompson",
            role: "Customer Success Manager at ServicePro",
            content: "ChatAssist handles 80% of our customer inquiries automatically. Our team can now focus on complex issues while the AI takes care of the rest.",
            rating: 5,
            accent: "border-l-chart-3"
        }
    ];

    const faqs = [
        {
            question: "How quickly can I add the chatbot to my website?",
            answer: "You can have ChatAssist running on your website in under 5 minutes. Simply copy and paste our embed code into your website's HTML, and the chatbot will appear instantly."
        },
        {
            question: "Do I need technical knowledge to set it up?",
            answer: "Not at all! Our chatbot is designed for non-technical users. The setup process is as simple as copying and pasting a single line of code, and you can customize everything through our intuitive dashboard."
        },
        {
            question: "Can the AI be trained on my specific business?",
            answer: "Yes! You can train the AI on your products, services, and company information. Upload your knowledge base, FAQs, or website content, and the AI will learn to answer questions specific to your business."
        },
        {
            question: "What happens to the leads the chatbot captures?",
            answer: "All leads are automatically saved to your dashboard and can be exported to your CRM or email marketing platform. You can also set up real-time notifications to follow up immediately with high-quality leads."
        },
        {
            question: "Is my customer data secure?",
            answer: "Absolutely. We use enterprise-grade encryption and are GDPR compliant. All conversations and customer data are securely stored and never shared with third parties."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-chart-1 to-chart-2 text-white">
                            {/*<MessageCircle className="h-4 w-4" />*/}
                            <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                                <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                            </svg>
                        </div>
                        <span className="text-lg font-semibold">WidgetWise</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-sm transition-colors hover:text-chart-1">Features</a>
                        <a href="#testimonials" className="text-sm transition-colors hover:text-chart-2">Testimonials</a>
                        <a href="#faq" className="text-sm transition-colors hover:text-chart-3">FAQ</a>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="sm">Sign In</Button>
                        <Button size="sm" className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90">Get Started</Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t bg-background">
                        <nav className="container py-4 space-y-3">
                            <a href="#features" className="block text-sm transition-colors hover:text-chart-1">Features</a>
                            <a href="#testimonials" className="block text-sm transition-colors hover:text-chart-2">Testimonials</a>
                            <a href="#faq" className="block text-sm transition-colors hover:text-chart-3">FAQ</a>
                            <div className="pt-4 space-y-2">
                                <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                                <Button size="sm" className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90">Get Started</Button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="w-full px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
                <div className="text-center space-y-8 max-w-4xl mx-auto relative">
                    <Badge variant="secondary" className="mx-auto bg-gradient-to-r from-chart-1/10 to-chart-2/10 border-chart-1/20">
                        🤖 New: Advanced lead scoring and qualification features
                    </Badge>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl">
                        Turn website visitors into
                        <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent"> qualified leads</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        The AI-powered chatbot that engages visitors, captures leads, and provides instant customer support. Increase conversions while you sleep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-base bg-[#96a4df] hover:bg-[#96a4df]/90">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-base border-chart-1/20 hover:bg-chart-1/5">
                            See Demo
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-chart-4" />
                            <span>5-minute setup</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-chart-4" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-chart-4" />
                            <span>Works on any website</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-muted/20 to-muted/40">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="secondary" className="bg-chart-3/10 border-chart-3/20 text-chart-3">Features</Badge>
                    <h2 className="text-3xl md:text-4xl">
                        Everything you need to capture more leads
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful AI features designed to engage visitors, qualify prospects, and convert more browsers into buyers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-sm bg-background/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
                            <CardHeader>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            {/*<section id="testimonials" className="w-full px-4 sm:px-6 lg:px-8 py-24 relative">*/}
            {/*    /!* Subtle gradient background *!/*/}
            {/*    <div className="absolute inset-0 bg-gradient-to-tr from-chart-5/5 via-transparent to-chart-4/5 pointer-events-none" />*/}

            {/*    <div className="text-center space-y-4 mb-16 relative">*/}
            {/*        <Badge variant="secondary" className="bg-chart-2/10 border-chart-2/20 text-chart-2">Testimonials</Badge>*/}
            {/*        <h2 className="text-3xl md:text-4xl">*/}
            {/*            Trusted by teams worldwide*/}
            {/*        </h2>*/}
            {/*        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">*/}
            {/*            Join thousands of businesses that are already converting more visitors with ChatAssist.*/}
            {/*        </p>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">*/}
            {/*        {testimonials.map((testimonial, index) => (*/}
            {/*            <Card key={index} className={`border-0 shadow-sm bg-background/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 border-l-4 ${testimonial.accent}`}>*/}
            {/*                <CardHeader>*/}
            {/*                    <div className="flex gap-1 mb-4">*/}
            {/*                        {[...Array(testimonial.rating)].map((_, i) => (*/}
            {/*                            <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />*/}
            {/*                        ))}*/}
            {/*                    </div>*/}
            {/*                    <CardDescription className="text-base leading-relaxed">*/}
            {/*                        &apos;{testimonial.content}&apos;*/}
            {/*                    </CardDescription>*/}
            {/*                </CardHeader>*/}
            {/*                <CardContent>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-medium">{testimonial.name}</p>*/}
            {/*                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>*/}
            {/*                    </div>*/}
            {/*                </CardContent>*/}
            {/*            </Card>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* FAQ Section */}
            <section id="faq" className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-muted/10 to-muted/30">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="secondary" className="bg-chart-5/10 border-chart-5/20 text-chart-5">FAQ</Badge>
                    <h2 className="text-3xl md:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions about ChatAssist? We have answers. If you need more help, our support team is here for you.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-background/80 backdrop-blur-sm hover:shadow-sm transition-shadow">
                                <AccordionTrigger className="text-left hover:no-underline hover:text-chart-1 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pt-2">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 sm:px-6 lg:px-8 py-24 relative">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 pointer-events-none rounded-2xl" />

                <div className="text-center space-y-8 max-w-3xl mx-auto relative">
                    <h2 className="text-3xl md:text-4xl">
                        Ready to capture more leads?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of businesses that are already converting more visitors into customers with ChatAssist.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-base bg-[#96a4df] hover:bg-[#96a4df]/90">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-base border-chart-1/20 hover:bg-chart-1/5">
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-gradient-to-b from-background to-muted/20">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-2 text-white">
                                    <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                                        <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                        <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                        <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                    </svg>
                                </div>
                                <span className="text-lg font-semibold">WidgetWise</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                The AI-powered chatbot that turns website visitors into qualified leads. Engage, capture, convert.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4>Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-chart-1 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-chart-1 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-chart-1 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-chart-1 transition-colors">API Reference</a></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4>Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-chart-2 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-chart-2 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-chart-2 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-chart-2 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4>Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-chart-3 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-chart-3 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-chart-3 transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-chart-3 transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 ChatAssist. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-chart-1 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-chart-2 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}