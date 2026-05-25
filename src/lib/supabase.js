import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfbxoqkxibhztovhyxqn.supabase.co'
const supabaseKey = 'sb_publishable_LZykDAeD6v3EaW0VaJkSdw_Hhm2L2vG'

export const supabase = createClient(supabaseUrl, supabaseKey)
