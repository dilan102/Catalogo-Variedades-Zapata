import { getIronSession, type SessionOptions } from 'iron-session'

export type AdminSession = {
  isAdmin?: boolean
  createdAt?: number
}

function getSessionOptions(): SessionOptions {
  const sessionSecret = process.env.SESSION_SECRET

  if (!sessionSecret) {
    throw new Error('La variable de entorno SESSION_SECRET no está configurada.')
  }

  return {
    password: sessionSecret,
    cookieName: 'admin-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    ttl: 60 * 60 * 24 * 7,
  }
}

export async function getAdminSession(request: Request, response: Response) {
  const session = await getIronSession(request, response, getSessionOptions())
  return session as typeof session & { admin?: AdminSession }
}
