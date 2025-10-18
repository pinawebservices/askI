/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
        serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },

    // Security Headers - Protection against common web vulnerabilities
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/:path*',
                headers: [
                    {
                        // Prevents clickjacking attacks by controlling iframe embedding
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN', // Allows your own site to iframe itself, blocks external sites
                    },
                    {
                        // Prevents MIME-type sniffing attacks
                        key: 'X-Content-Type-Options',
                        value: 'nosniff', // Forces browser to respect declared content-type
                    },
                    {
                        // Controls what referrer information is sent with requests
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin', // Only sends origin to external sites, full URL to same-origin
                    },
                    {
                        // Disables unnecessary browser features (camera, mic, geolocation)
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()', // Disable tracking and unnecessary APIs
                    },
                    {
                        // Content Security Policy - Defense-in-depth against XSS
                        // Start permissive for Next.js, can tighten later
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed for Next.js
                            "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-jsx
                            "img-src 'self' data: https:", // Allow images from anywhere (for user content)
                            "font-src 'self' data:", // Allow fonts
                            "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com https://*.pinecone.io", // Allow API connections
                            "frame-ancestors 'self'", // Redundant with X-Frame-Options but good for defense-in-depth
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
