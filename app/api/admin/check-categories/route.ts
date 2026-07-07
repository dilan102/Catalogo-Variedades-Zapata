import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { requireAdminSession } from '@/lib/requireAdmin'

export async function GET(request: Request) {
  try {
    const isAuthenticated = await requireAdminSession(request)

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
    }

    const supabase = createClient()

    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .order('order')

    if (sectionsError) {
      return NextResponse.json({ success: false, message: 'Error al obtener secciones' }, { status: 500 })
    }

    const { data: subsections, error: subsectionsError } = await supabase
      .from('subsections')
      .select('*')
      .order('order')

    if (subsectionsError) {
      return NextResponse.json({ success: false, message: 'Error al obtener subsecciones' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sections: sections || [],
      subsections: subsections || [],
      totalSections: sections?.length || 0,
      totalSubsections: subsections?.length || 0,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 })
  }
}
