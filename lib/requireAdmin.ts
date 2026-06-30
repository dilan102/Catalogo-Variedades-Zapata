import { cookies } from 'next/headers'

// TODO: persist and invalidate admin sessions in a dedicated table for stronger control.
export async function requireAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin-session')

  return Boolean(sessionCookie?.value)
}
