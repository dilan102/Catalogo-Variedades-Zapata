import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json({ success: false, message: 'Configuración de servidor incompleta' }, { status: 500 })
    }

    if (username === adminUsername && password === adminPassword) {
      const cookieStore = await cookies()
      
      // Generar un token de sesión aleatorio
      const sessionToken = crypto.randomUUID()
      
      // Establecer cookie httpOnly, secure, sameSite=lax con expiración de 7 días
      cookieStore.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      })

      return NextResponse.json({ success: true, message: 'Login exitoso' })
    } else {
      return NextResponse.json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 })
  }
}
