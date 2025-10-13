import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

import * as CONFIG from '@/config';

// ----------------------------------------------------------------------

const isSupabase = CONFIG.auth.method === 'supabase';

const supabaseUrl = '';//CONFIG.supabase.url;
const supabaseKey = '';//CONFIG.supabase.key;

export const supabase = isSupabase
  ? createClient(supabaseUrl, supabaseKey)
  : ({} as SupabaseClient<any, 'public', any>);
