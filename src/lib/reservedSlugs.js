/** Paths reserved by the systems hub — never treat as clinic slugs. */
export const RESERVED_SLUGS = new Set([
  'restaurants',
  'dental',
  'owner',
  'hub',
  'clinics',
  'gyms',
  'research',
  'platform',
  'signup',
  'assets',
  'clinic-signup',
])

export function isReservedSlug(slug) {
  if (!slug) return false
  return RESERVED_SLUGS.has(String(slug).toLowerCase())
}
