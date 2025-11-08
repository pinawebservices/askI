// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const code = requestUrl.searchParams.get('code');
    const redirect_to = requestUrl.searchParams.get('redirect_to');
    const next = requestUrl.searchParams.get('next') || redirect_to || '/';
    const error_description = requestUrl.searchParams.get('error_description');

    // DEBUG
    // console.log('Auth callback params:', { token_hash, type, code, next, redirect_to, error_description });

    if (error_description) {
        console.error('Auth callback error:', error_description);
        const errorUrl = new URL('/forgot-password', requestUrl.origin);
        errorUrl.searchParams.set('error', error_description);
        return NextResponse.redirect(errorUrl);
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    // Handle PKCE flow (if code exists)
    if (code) {
        console.log('Exchanging code for session...');
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log('✅ Session created successfully');
            const redirectUrl = new URL(next, requestUrl.origin);
            return NextResponse.redirect(redirectUrl);
        }

        console.error('❌ Error exchanging code for session:', error);
    }

    // Handle token hash flow (email magic link / password recovery)
    if (token_hash && type) {
        console.log('Verifying OTP...');
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
        });

        if (!error) {
            console.log('✅ OTP verified successfully');
            const redirectUrl = new URL(next, requestUrl.origin);
            return NextResponse.redirect(redirectUrl);
        }

        console.error('❌ Error verifying OTP:', error);
    }

    // Check if session already exists (from Supabase's verification redirect)
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        console.log('✅ Session already exists, redirecting to next page');
        const redirectUrl = new URL(next, requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
    }

    // If no code, token_hash, or session, redirect with error
    console.error('❌ No valid auth method found');
    const errorUrl = new URL('/forgot-password', requestUrl.origin);
    errorUrl.searchParams.set('error', 'Invalid or expired reset link. Please try again.');
    return NextResponse.redirect(errorUrl);
}