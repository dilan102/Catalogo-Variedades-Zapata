import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin-session')
  const authenticated = Boolean(sessionCookie?.value)

  return NextResponse.json({ authenticated })
}
