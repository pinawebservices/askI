// app/api/admin/clear-cache/route.js - NEW FILE for testing
import { GoogleSheetsClient } from '@/lib/googleSheetsClient';

export async function POST(request) {
    try {
        const { customerId } = await request.json();

        if (!customerId) {
            return Response.json({ error: 'customerId required' }, { status: 400 });
        }

        // Create client and clear its cache
        const client = new GoogleSheetsClient(customerId);
        client.clearCache();

        console.log(`🗑️ Cache cleared for ${customerId}`);

        return Response.json({
            success: true,
            message: `Cache cleared for ${customerId}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Cache clear error:', error);
        return Response.json({
            error: 'Failed to clear cache',
            details: error.message
        }, { status: 500 });
    }
}

// Quick test endpoint to check cache status
export async function GET() {
    return Response.json({
        message: 'Cache control endpoint active',
        usage: 'POST with {"customerId": "demo-wellness"} to clear cache'
    });
}