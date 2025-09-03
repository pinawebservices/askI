export function ChatWidget() {
    return (
        <div className="fixed bottom-6 right-6">
            <button className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center border border-gray-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                    <path
                        d="M18 10C18 14.4183 14.4183 18 10 18C8.5 18 7.1 17.6 5.9 16.9L2 18L3.1 14.1C2.4 12.9 2 11.5 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    )
}
