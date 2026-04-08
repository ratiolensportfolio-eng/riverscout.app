// Admin user IDs and emails — these users can access /admin routes
export const ADMIN_USER_IDS = [
  'cd958898-e1da-442d-830b-5767f2e0b5ca',
]

export const ADMIN_EMAILS = [
  'paddle.rivers.us@gmail.com',
]

export function isAdmin(userId: string | undefined, email?: string | null): boolean {
  if (userId && ADMIN_USER_IDS.includes(userId)) return true
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true
  return false
}
