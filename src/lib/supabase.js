import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfbxoqkxibhztovhyxqn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYnhvcWt4aWJoenRvdmh5eHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDM5NjAsImV4cCI6MjA5MzY3OTk2MH0.bi7fLHfJ01nqThYIAUyUY-F4vLiLZ8R3TvCqrRcJNNU'

export const supabase = createClient(supabaseUrl, supabaseKey)
