import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('sections').select('id, name, slug, image_url').eq('is_active', true).order('order')
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, sections: data })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener secciones' }, { status: 500 })
  }
}

const sectionImages = {
  'dama': '/Dama.avif',
  'caballero': '/Caballero.jpg',
  'nino': '/Niño.webp',
  'nina': '/Niña.jpg',
  'accesorios': '/Accesorios.avif',
  'edredones': '/edredon.jpeg',
  'esika': '/Esika.png',
  'avon': '/Avon.png',
}

export async function POST() {
  try {
    const supabase = createClient()
    const results = []
    
    // Primero obtener todas las secciones para verificar los slugs
    const { data: sections, error: fetchError } = await supabase.from('sections').select('id, name, slug, image_url').eq('is_active', true)
    
    if (fetchError) {
      return NextResponse.json({ success: false, error: 'Error al obtener secciones: ' + fetchError.message }, { status: 500 })
    }
    
    console.log('Found sections:', sections)
    
    for (const section of sections || []) {
      const imageUrl = sectionImages[section.slug as keyof typeof sectionImages]
      if (imageUrl) {
        console.log(`Updating section ${section.slug} (${section.name}) with image: ${imageUrl}`)
        
        const { data, error } = await supabase
          .from('sections')
          .update({ image_url: imageUrl })
          .eq('id', section.id)
          .select()
        
        if (error) {
          console.error(`Error updating section ${section.slug}:`, error)
          results.push({ slug: section.slug, success: false, error: error.message })
        } else {
          console.log(`Updated section ${section.slug} with image: ${imageUrl}`, data)
          results.push({ slug: section.slug, success: true, data })
        }
      } else {
        console.log(`No image mapping found for section ${section.slug}`)
        results.push({ slug: section.slug, success: false, error: 'No image mapping found' })
      }
    }
    
    return NextResponse.json({ success: true, message: 'Secciones actualizadas correctamente', results })
  } catch (error) {
    console.error('Error updating section images:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar secciones' }, { status: 500 })
  }
}
