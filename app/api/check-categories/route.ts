import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .order('order')

    if (sectionsError) {
      return NextResponse.json({ error: 'Error al obtener secciones' }, { status: 500 })
    }

    const { data: subsections, error: subsectionsError } = await supabase
      .from('subsections')
      .select('*')
      .order('order')

    if (subsectionsError) {
      return NextResponse.json({ error: 'Error al obtener subsecciones' }, { status: 500 })
    }

    return NextResponse.json({ 
      sections: sections || [], 
      subsections: subsections || [],
      totalSections: sections?.length || 0,
      totalSubsections: subsections?.length || 0
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
