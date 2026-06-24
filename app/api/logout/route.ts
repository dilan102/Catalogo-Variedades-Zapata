import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Eliminar la cookie de sesión
    cookieStore.delete('admin-session')

    return NextResponse.json({ success: true, message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 })
  }
}
