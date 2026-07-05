import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { requireAdminSession } from '@/lib/requireAdmin'

const sectionImages = {
  dama: '/Dama.avif',
  caballero: '/Caballero.jpg',
  nino: '/Niño.webp',
  nina: '/Niña.jpg',
  accesorios: '/Accesorios.avif',
  edredones: '/edredon.jpeg',
  esika: '/Esika.png',
}

export async function GET() {
  try {
    const isAuthenticated = await requireAdminSession()

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
    }

    const supabase = createClient()
    const { data, error } = await supabase.from('sections').select('id, name, slug, image_url').eq('is_active', true).order('order')

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, sections: data })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ success: false, message: 'Error al obtener secciones' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const isAuthenticated = await requireAdminSession()

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
    }

    const supabase = createClient()
    const results = []

    const { data: sections, error: fetchError } = await supabase.from('sections').select('id, name, slug, image_url').eq('is_active', true)

    if (fetchError) {
      return NextResponse.json({ success: false, message: 'Error al obtener secciones: ' + fetchError.message }, { status: 500 })
    }

    for (const section of sections || []) {
      const imageUrl = sectionImages[section.slug as keyof typeof sectionImages]

      if (imageUrl) {
        const { error } = await supabase
          .from('sections')
          .update({ image_url: imageUrl })
          .eq('id', section.id)

        if (error) {
          results.push({ slug: section.slug, success: false, message: error.message })
        } else {
          results.push({ slug: section.slug, success: true })
        }
      } else {
        results.push({ slug: section.slug, success: false, message: 'No image mapping found' })
      }
    }

    return NextResponse.json({ success: true, message: 'Secciones actualizadas correctamente', results })
  } catch (error) {
    console.error('Error updating section images:', error)
    return NextResponse.json({ success: false, message: 'Error al actualizar secciones' }, { status: 500 })
  }
}
