import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'

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
    
    for (const [slug, imageUrl] of Object.entries(sectionImages)) {
      const { error } = await supabase
        .from('sections')
        .update({ image_url: imageUrl })
        .eq('slug', slug)
      
      if (error) {
        console.error(`Error updating section ${slug}:`, error)
      } else {
        console.log(`Updated section ${slug} with image: ${imageUrl}`)
      }
    }
    
    return NextResponse.json({ success: true, message: 'Secciones actualizadas correctamente' })
  } catch (error) {
    console.error('Error updating section images:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar secciones' }, { status: 500 })
  }
}
