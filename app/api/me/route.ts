import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession(request, new Response())
    const admin = session.admin
    const authenticated = Boolean(
      admin?.isAdmin === true &&
      typeof admin.createdAt === 'number' &&
      Date.now() - admin.createdAt <= 7 * 24 * 60 * 60 * 1000
    )

    return NextResponse.json({ authenticated })
  } catch (error) {
    console.error('Error verificando estado de sesión:', error)
    return NextResponse.json({ authenticated: false })
  }
}
