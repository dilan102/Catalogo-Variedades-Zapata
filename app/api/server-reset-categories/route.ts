import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const categoriesWithSubsections: Record<string, string[]> = {
  'Dama': ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos'],
  'Caballero': ['Pantalones', 'Pantalonetas', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Zapatos', 'Ropa interior', 'Ropa deportiva'],
  'Niño': ['Pantalones', 'Zapatos', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Ropa interior', 'Ropa deportiva'],
  'Niña': ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Zapatos', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias'],
  'Accesorios': ['Gafas', 'Relojería', 'Joyería', 'Tecnología'],
  'Edredones': ['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas'],
  'Esika': [],
  'Avon': []
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, message: 'Faltan credenciales de Supabase' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Iniciando reset con servidor Supabase...')

    // Eliminar todos los productos
    console.log('Eliminando productos...')
    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .not('id', 'is', null)
    
    if (deleteProductsError) {
      console.error('Error eliminando productos:', deleteProductsError)
    } else {
      console.log('Productos eliminados')
    }

    // Eliminar todas las subsecciones
    console.log('Eliminando subsecciones...')
    const { data: allSubsections } = await supabase.from('subsections').select('id')
    
    if (allSubsections && allSubsections.length > 0) {
      const subsectionIds = allSubsections.map(s => s.id)
      const { error: deleteSubsectionsError } = await supabase
        .from('subsections')
        .delete()
        .in('id', subsectionIds)
      
      if (deleteSubsectionsError) {
        console.error('Error eliminando subsecciones:', deleteSubsectionsError)
      } else {
        console.log('Subsecciones eliminadas')
      }
    }

    // Eliminar todas las secciones
    console.log('Eliminando secciones...')
    const { data: allSections } = await supabase.from('sections').select('id')
    
    if (allSections && allSections.length > 0) {
      const sectionIds = allSections.map(s => s.id)
      const { error: deleteSectionsError } = await supabase
        .from('sections')
        .delete()
        .in('id', sectionIds)
      
      if (deleteSectionsError) {
        console.error('Error eliminando secciones:', deleteSectionsError)
      } else {
        console.log('Secciones eliminadas')
      }
    }

    // Crear nuevas categorías
    console.log('Creando nuevas categorías...')
    for (const [categoryName, subsections] of Object.entries(categoriesWithSubsections)) {
      const slug = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
      
      const { data: newSection, error: sectionError } = await supabase
        .from('sections')
        .insert({
          name: categoryName,
          slug,
          description: `Catálogo de ${categoryName.toLowerCase()}`,
          order: Object.keys(categoriesWithSubsections).indexOf(categoryName),
          is_active: true
        })
        .select()
        .single()
      
      if (sectionError) {
        console.error(`Error creando sección "${categoryName}":`, sectionError)
        continue
      }
      
      const sectionId = newSection.id
      console.log(`Sección "${categoryName}" creada con ID: ${sectionId}`)
      
      // Crear subsecciones
      if (subsections.length > 0) {
        for (const subsectionName of subsections) {
          const subsectionSlug = subsectionName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
          
          const { error: subsectionError } = await supabase
            .from('subsections')
            .insert({
              section_id: sectionId,
              name: subsectionName,
              slug: subsectionSlug,
              description: `${subsectionName} de ${categoryName}`,
              order: subsections.indexOf(subsectionName),
              is_active: true
            })
          
          if (subsectionError) {
            console.error(`Error creando subsección "${subsectionName}":`, subsectionError)
          } else {
            console.log(`Subsección "${subsectionName}" creada para "${categoryName}"`)
          }
        }
      }
    }
    
    console.log('Reset de categorías completado exitosamente')
    return NextResponse.json({ success: true, message: 'Categorías reseteadas e inicializadas correctamente' })
  } catch (error) {
    console.error('Error reseteando categorías:', error)
    return NextResponse.json({ success: false, message: 'Error reseteando categorías' }, { status: 500 })
  }
}
