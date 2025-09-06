import { Button } from "@/components/ui/button"

export function FinHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center">
                <div className="text-black text-2xl font-bold">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-black">
                        <path d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z" fill="currentColor" />
                    </svg>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-black hover:text-black hover:bg-black/10">
                    View demo
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">Start free trial</Button>
            </div>
        </header>
    )
}
