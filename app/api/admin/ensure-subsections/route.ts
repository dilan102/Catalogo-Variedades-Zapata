import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { categoriesWithSubsections, slugify } from '@/lib/init-categories'
import { requireAdminSession } from '@/lib/requireAdmin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  if (!await requireAdminSession(req)) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { success: false, message: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    )
  }

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey)
    
    const { sectionName } = await req.json()

    if (!sectionName || !categoriesWithSubsections[sectionName]) {
      return NextResponse.json(
        { success: false, message: `Sección "${sectionName}" no encontrada en la configuración.` },
        { status: 400 }
      )
    }

    // Obtener la sección
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('name', sectionName)
      .single()

    if (sectionError || !section) {
      return NextResponse.json(
        { success: false, message: `Sección "${sectionName}" no existe en la base de datos.` },
        { status: 404 }
      )
    }

    const defaultSubsections = categoriesWithSubsections[sectionName]
    const { data: existingSubsections } = await supabase
      .from('subsections')
      .select('name')
      .eq('section_id', section.id)

    const existingNames = new Set((existingSubsections ?? []).map((s) => s.name.toLowerCase()))
    const missingSubsections = defaultSubsections.filter(
      (name) => !existingNames.has(name.toLowerCase())
    )

    if (missingSubsections.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No hay subsecciones faltantes.', created: [] },
        { status: 200 }
      )
    }

    const insertPayload = missingSubsections.map((subsectionName, index) => ({
      section_id: section.id,
      name: subsectionName,
      slug: slugify(subsectionName),
      description: `${subsectionName} de ${sectionName}`,
      order: defaultSubsections.indexOf(subsectionName),
      is_active: true,
    }))

    const { data: createdSubsections, error: insertError } = await supabase
      .from('subsections')
      .insert(insertPayload)
      .select('*')

    if (insertError) {
      return NextResponse.json(
        { success: false, message: `Error creando subsecciones: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Creadas ${missingSubsections.length} subsecciones.`,
        created: missingSubsections,
        subsections: createdSubsections
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en ensure-subsections:', error)
    return Response.json(
      { success: false, message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
