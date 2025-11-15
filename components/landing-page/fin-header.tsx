import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";

export function FinHeader() {

    const router = useRouter();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-8 bg-white shadow-sm">
            <div className="flex items-center gap-2">
                <div className="text-black text-2xl font-bold">
                    <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                        <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                        <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                        <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                    </svg>
                </div>
                <span className="text-black text-xl font-semibold">WidgetWise</span>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    className="text-black hover:text-black hover:bg-black/10"
                    onClick={() => router.push('/login')}
                >
                    Login
                </Button>
                <Button
                    className="bg-[#96a4df] hover:bg-[#96a4df]/90 text-white border border-white/20 shadow-sm"
                    onClick={() => router.push('/signup')}
                >
                    Start free trial
                </Button>
            </div>
        </header>
    )
}
