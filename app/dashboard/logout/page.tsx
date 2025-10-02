// app/dashboard/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut();
            router.push('/login');
        };

        logout();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Logging out...</p>
        </div>
    );
}