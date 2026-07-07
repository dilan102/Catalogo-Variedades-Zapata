import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logout exitoso' })
    const session = await getAdminSession(request, response)
    await session.destroy()
    return response
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 })
  }
}
