// lib/supabase-client.ts - MOVE HERE
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const supabase = createClientComponentClient<Database>();