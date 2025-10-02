// middleware.ts
import { createClient } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createClient(req, res);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // If no session and trying to access dashboard, redirect to login
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = new URL('/login', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If has session and trying to access login/signup, redirect to dashboard
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {

        const { data: userData } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', session.user.id)
            .single();

        if (userData?.organization_id) {
            const { data: client } = await supabase
                .from('clients')
                .select('client_id')
                .eq('organization_id', userData.organization_id)
                .single();

            if (client) {
                // Redirect to their specific dashboard
                return NextResponse.redirect(new URL(`/dashboard/${client.client_id}`, req.url));
            }
        }

        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

// Specify which routes this middleware should run on
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/signup',
    ],
};