import { createClient } from '@/lib/supabase/server-client';
import { notFound } from 'next/navigation';
import type { ChatConversation, CapturedLead } from '@/types/database';
import { AnalyticsDashboard } from './analytics-dashboard';

interface AnalyticsPageProps {
    params: Promise<{
        clientId: string;
    }>;
    searchParams: Promise<{
        dateFrom?: string;
        dateTo?: string;
    }>;
}

export default async function AnalyticsPage({ params, searchParams }: AnalyticsPageProps) {
    const { clientId } = await params;
    const filters = await searchParams;
    const supabase = await createClient();

    // Set default date range (last 30 days)
    const dateTo = filters.dateTo || new Date().toISOString().split('T')[0];
    const dateFrom = filters.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch conversations with date filter
    let conversationsQuery = supabase
        .from('chat_conversations')
        .select('*')
        .eq('client_id', clientId)
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo + 'T23:59:59.999Z')
        .order('created_at', { ascending: true });

    const { data: conversations, error: conversationsError } = await conversationsQuery;

    if (conversationsError) {
        console.error('[Analytics] Error fetching conversations:', conversationsError);
    }

    // Fetch leads with date filter
    let leadsQuery = supabase
        .from('captured_leads')
        .select('*')
        .eq('client_id', clientId)
        .gte('captured_at', dateFrom)
        .lte('captured_at', dateTo + 'T23:59:59.999Z')
        .order('captured_at', { ascending: true });

    const { data: leads, error: leadsError } = await leadsQuery;

    if (leadsError) {
        console.error('[Analytics] Error fetching leads:', leadsError);
    }

    // Verify client exists and get timezone
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('business_name, timezone')
        .eq('client_id', clientId)
        .single();

    if (clientError || !client) {
        notFound();
    }

    return (
        <AnalyticsDashboard
            conversations={conversations as ChatConversation[] || []}
            leads={leads as CapturedLead[] || []}
            clientId={clientId}
            businessName={client.business_name}
            timezone={client.timezone || 'America/New_York'}
            dateFrom={dateFrom}
            dateTo={dateTo}
        />
    );
}