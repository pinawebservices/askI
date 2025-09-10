// / app/api/test-supabase/route.js
import { supabaseAdmin } from '@/lib/supabase-admin.js';

export async function GET() {
    try {
        // Test database connection
        const { data, error } = await supabaseAdmin
            .from('clients')
            .select('*')
            .limit(1);

        if (error) throw error;

        return Response.json({
            success: true,
            message: 'Supabase connected successfully!',
            data
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}