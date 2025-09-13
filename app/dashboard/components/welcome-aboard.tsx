import Link from "next/link";
import {CheckCircleIcon} from "lucide-react";

interface WelcomeAboardProps {
        clientId: string;
}

export default async function WelcomeAboard({ clientId }: WelcomeAboardProps) {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4">Welcome aboard! 🎉</h1>
                    <p className="text-lg mb-4">Your subscription is being set up.</p>
                    <p className="text-gray-600 mb-6">You&apos;ll receive an email confirmation shortly.</p>
                    <Link
                        href={`/dashboard/${clientId}`}
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Continue to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}