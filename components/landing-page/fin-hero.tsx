import { Button } from "@/components/ui/button"
import ChatDemoAnimation from "@/components/landing-page/chat-demo-animation";
import {useRouter} from "next/navigation";

export function FinHero() {

    const router = useRouter();

    return (
        <section className="px-6 py-16 lg:px-8 lg:pt-20" >
            <div className="mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl leading-tight text-black font-sans font-light" >
                            Not Another Chatbot.<br />
                            <span className="font-medium">A Smart Agent.</span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                            Introducing your website&apos;s new AI Agent — never miss another lead. Trained on your unique business knowledge to answer questions, qualify prospects, and engage visitors with expert-level responses that reflect your brand and expertise.
                        </p>

                        <div className="flex gap-4">
                            <Button
                                className="bg-black text-white hover:bg-gray-800 px-6 py-3"
                                onClick={() => router.push('/signup')}
                            >
                                Start free trial
                            </Button>
                            {/*<Button*/}
                            {/*    variant="outline"*/}
                            {/*    className="border-black text-black hover:bg-black hover:text-white px-6 py-3 bg-transparent"*/}
                            {/*>*/}
                            {/*    View demo*/}
                            {/*</Button>*/}
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <ChatDemoAnimation />
                        {/*<div className="w-80 h-96 bg-white rounded-lg border-2 border-[#13D4D4] p-4 relative shadow-lg">*/}
                        {/*    /!* Placeholder for Fin AI agent interface *!/*/}
                        {/*    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">*/}
                        {/*        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#13D4D4]">*/}
                        {/*            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor" />*/}
                        {/*        </svg>*/}
                        {/*        <span className="text-black font-medium">Fin</span>*/}
                        {/*        <div className="ml-auto flex gap-1">*/}
                        {/*            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>*/}
                        {/*            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>*/}
                        {/*            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*    <div className="space-y-4">*/}
                        {/*        <div className="bg-gray-50 border border-[#13D4D4]/20 rounded-lg p-3">*/}
                        {/*            <div className="flex items-center gap-2 mb-2">*/}
                        {/*                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#13D4D4]">*/}
                        {/*                    <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor" />*/}
                        {/*                </svg>*/}
                        {/*                <span className="text-black text-sm">Fin • AI Agent</span>*/}
                        {/*            </div>*/}
                        {/*            <p className="text-gray-700 text-sm">Hi Sara, how can I help?</p>*/}
                        {/*        </div>*/}

                        {/*        /!* Placeholder content *!/*/}
                        {/*        <div className="text-center text-gray-500 text-sm">[Fin AI Agent Interface Placeholder]</div>*/}
                        {/*    </div>*/}

                        {/*    <div className="absolute bottom-4 left-4 right-4">*/}
                        {/*        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2">*/}
                        {/*            <span className="text-gray-600 text-sm flex-1">Wh</span>*/}
                        {/*            <div className="w-6 h-6 bg-[#13D4D4] rounded-full flex items-center justify-center">*/}
                        {/*                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">*/}
                        {/*                    <path*/}
                        {/*                        d="M1 6L11 6M6 1L11 6L6 11"*/}
                        {/*                        stroke="currentColor"*/}
                        {/*                        strokeWidth="1.5"*/}
                        {/*                        strokeLinecap="round"*/}
                        {/*                        strokeLinejoin="round"*/}
                        {/*                    />*/}
                        {/*                </svg>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </section>
    )
}
