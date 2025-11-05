import { createClient } from '@/lib/supabase/server-client';
import { notFound } from 'next/navigation';
import { LeadsTable } from './leads-table';
import { LeadFilters } from './lead-filters';

interface LeadsPageProps {
    params: Promise<{
        clientId: string;
    }>;
    searchParams: Promise<{
        status?: string;
        source?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    }>;
}

export default async function LeadsPage({ params, searchParams }: LeadsPageProps) {
    const { clientId } = await params;
    const filters = await searchParams;
    const supabase = await createClient();

    console.log('[Leads Page] Loading for clientId:', clientId);

    // Build query with filters
    let query = supabase
        .from('captured_leads')
        .select('*')
        .eq('client_id', clientId);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (filters.source) {
        query = query.eq('source', filters.source);
    }

    if (filters.dateFrom) {
        query = query.gte('captured_at', filters.dateFrom);
    }

    if (filters.dateTo) {
        query = query.lte('captured_at', filters.dateTo);
    }

    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    // Order by most recent first
    query = query.order('captured_at', { ascending: false });

    console.log('[Leads Page] Executing query...');
    const { data: leads, error } = await query;
    console.log('[Leads Page] Query result - leads:', leads?.length, 'error:', error);

    if (error) {
        console.error('[Leads Page] Error fetching leads:', error);
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Lead Management</h1>
                <p className="text-red-600">Error loading leads: {error.message}</p>
            </div>
        );
    }

    // Get unique sources for filter dropdown
    const { data: sources } = await supabase
        .from('captured_leads')
        .select('source')
        .eq('client_id', clientId)
        .not('source', 'is', null);

    const uniqueSources = Array.from(
        new Set(sources?.map(s => s.source).filter((s): s is string => Boolean(s)))
    );

    // Calculate stats
    const stats = {
        total: leads?.length || 0,
        new: leads?.filter(l => l.status === 'new').length || 0,
        contacted: leads?.filter(l => l.status === 'contacted').length || 0,
        qualified: leads?.filter(l => l.status === 'qualified').length || 0,
        won: leads?.filter(l => l.status === 'won').length || 0,
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Lead Management</h1>
                <p className="text-gray-600 mt-1">
                    Manage and track your captured leads
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatCard label="Total Leads" value={stats.total} color="white" />
                <StatCard label="New" value={stats.new} color="blue" />
                <StatCard label="Contacted" value={stats.contacted} color="yellow" />
                <StatCard label="Qualified" value={stats.qualified} color="purple" />
                <StatCard label="Won" value={stats.won} color="green" />
            </div>

            {/* Filters */}
            <LeadFilters
                currentFilters={filters}
                sources={uniqueSources}
            />

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow">
                {leads && leads.length > 0 ? (
                    <LeadsTable leads={leads} clientId={clientId} />
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg">No leads found</p>
                        <p className="text-sm mt-2">
                            Leads will appear here once your chatbot captures contact information
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: number;
    color: 'white' | 'blue' | 'yellow' | 'purple' | 'green';
}

function StatCard({ label, value, color }: StatCardProps) {
    const colorClasses = {
        white: 'bg-white text-gray-900 border border-gray-200',
        blue: 'bg-blue-50 text-blue-900 border border-blue-200',
        yellow: 'bg-yellow-50 text-yellow-900 border border-yellow-200',
        purple: 'bg-purple-50 text-purple-900 border border-purple-200',
        green: 'bg-green-50 text-green-900 border border-green-200',
    };

    return (
        <div className={`p-4 rounded-lg shadow-sm ${colorClasses[color]}`}>
            <h3 className="text-sm font-medium opacity-75">{label}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}