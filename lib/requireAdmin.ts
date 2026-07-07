import { getAdminSession } from '@/lib/session'

export async function requireAdminSession(request: Request) {
  try {
    const response = new Response()
    const session = await getAdminSession(request, response)
    const admin = session.admin

    if (!admin?.isAdmin || !admin.createdAt) {
      return false
    }

    const sessionAgeMs = Date.now() - admin.createdAt
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000

    return sessionAgeMs <= maxAgeMs
  } catch (error) {
    console.error('Error verificando sesión admin:', error)
    return false
  }
}
