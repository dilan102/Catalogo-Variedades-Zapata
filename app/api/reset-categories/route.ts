import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { initializeCategories } from '@/lib/init-categories'

export async function POST() {
  try {
    const supabase = createClient()

    // Eliminar todas las subsecciones
    const { error: deleteSubsectionsError } = await supabase
      .from('subsections')
      .delete()
      .not('id', 'is', null)
    
    if (deleteSubsectionsError) {
      console.error('Error eliminando subsecciones:', deleteSubsectionsError)
    }

    // Eliminar todas las secciones
    const { error: deleteSectionsError } = await supabase
      .from('sections')
      .delete()
      .not('id', 'is', null)
    
    if (deleteSectionsError) {
      console.error('Error eliminando secciones:', deleteSectionsError)
    }

    // Inicializar nuevas categorías
    await initializeCategories()

    return NextResponse.json({ success: true, message: 'Categorías reseteadas e inicializadas correctamente' })
  } catch (error) {
    console.error('Error reseteando categorías:', error)
    return NextResponse.json({ success: false, message: 'Error reseteando categorías' }, { status: 500 })
  }
}
