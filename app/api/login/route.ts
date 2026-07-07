import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json({ success: false, message: 'Configuración de servidor incompleta' }, { status: 500 })
    }

    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Login exitoso' })
      const session = await getAdminSession(request, response)
      session.admin = { isAdmin: true, createdAt: Date.now() }
      await session.save()
      return response
    }

    return NextResponse.json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 })
  }
}
