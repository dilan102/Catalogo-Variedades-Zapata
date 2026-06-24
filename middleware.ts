import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Verificar si es una ruta de admin
  if (path.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin-session')
    
    // Si no hay sesión, redirigir a la página principal
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
