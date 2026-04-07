// Admin user IDs — only these users can access /admin routes
export const ADMIN_USER_IDS = [
  'cd958898-e1da-442d-830b-5767f2e0b5ca',
]

export function isAdmin(userId: string | undefined): boolean {
  return !!userId && ADMIN_USER_IDS.includes(userId)
}
