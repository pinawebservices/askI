import { supabase } from "@/lib/services/supabase-client"
// import type { User, Organization, Client } from '../types/database.ts';
import type { Database } from '@/types/supabase';

type Organization = Database['public']['Tables']['organizations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type PlanType = 'none' | 'basic' | 'pro' | 'premium';

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from('users')
        .select('*, organization:organizations(*)')
        .eq('id', user.id)
        .single();

    return data;
}

export async function getUserOrganization(userId: string): Promise<Organization | null> {

    const { data } = await supabase
        .from('users')
        .select(`*,organization:organizations(*)`)
        .eq('id', userId)
        .single();

    const typedData = data as { organizations: Organization } | null;
    return typedData?.organizations || null;
}

export async function getOrganizationClient(organizationId: string): Promise<Client | null> {

    const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organizationId)
        .single();

    return data;
}

export async function getUserTier(userId: string): Promise< 'none'|'basic' | 'pro' | 'premium'> {
    const org = await getUserOrganization(userId);
    return (org?.plan_type as PlanType) || 'none';
}