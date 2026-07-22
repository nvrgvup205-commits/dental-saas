import { createClient } from '@supabase/supabase-js'

// Shared project with the gyms system (dental tables coexist; do not alter gym_* tables)
const supabaseUrl = 'https://khzrapojrkhxjsjgnflr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoenJhcG9qcmtoeGpzamduZmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDYzNjEsImV4cCI6MjA5NTIyMjM2MX0.tTVOQYRhH5XfcmGWK2b3YWliEMPQmgYcEQZErje2PIM'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: { eventsPerSecond: 10 }
  }
})

// ═══════════════════════════════════════════════════════════
// 📸 Storage Helpers - رفع الصور
// ═══════════════════════════════════════════════════════════
export const uploadImage = async (bucket, file, prefix = '') => {
  if (!file) return { url: null, error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) return { url: null, error: error.message }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: publicUrl, path: fileName, error: null }
}

export const deleteImage = async (bucket, path) => {
  if (!path) return { error: null }
  const fileName = path.split('/').pop()
  return await supabase.storage.from(bucket).remove([fileName])
}
