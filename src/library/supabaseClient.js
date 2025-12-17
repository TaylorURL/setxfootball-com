import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdxydyeqtoffsepvxqmg.supabase.co';
const supabaseKey = 'sb_publishable_9oom7UDUMmJ2RNKIzpM86w_XMM-c5QS';

export const supabase = createClient(supabaseUrl, supabaseKey);
