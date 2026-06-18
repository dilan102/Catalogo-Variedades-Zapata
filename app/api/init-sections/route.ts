import { NextResponse } from 'next/server'
import { initDefaultSections } from '@/lib/init-sections'

export async function GET() {
  try {
    await initDefaultSections()
    return NextResponse.json({ success: true, message: 'Secciones inicializadas correctamente' })
  } catch (error) {
    console.error('Error al inicializar secciones:', error)
    return NextResponse.json({ success: false, error: 'Error al inicializar secciones' }, { status: 500 })
  }
}
