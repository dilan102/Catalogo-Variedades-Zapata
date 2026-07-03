import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { requireAdminSession } from '@/lib/requireAdmin'

const categoriesWithSubsections: Record<string, string[]> = {
  Dama: ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos'],
  Caballero: ['Pantalones', 'Pantalonetas', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Zapatos', 'Ropa interior', 'Ropa deportiva'],
  Niño: ['Pantalones', 'Zapatos', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Ropa interior'],
  Niña: ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Zapatos', 'Vestidos', 'Corsets', 'Ropa interior', 'Medias'],
  Accesorios: ['Gafas', 'Relojería', 'Joyería', 'Tecnología'],
  Edredones: ['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas'],
  Esika: [],
  Joven: ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos'],
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
}

export async function POST() {
  try {
    const isAuthenticated = await requireAdminSession()

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
    }

    const supabase = createClient()

    console.log('Iniciando reset administrativo de categorías...')

    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .not('id', 'is', null)

    if (deleteProductsError) {
      console.error('Error eliminando productos:', deleteProductsError)
    }

    const { data: existingSubsections } = await supabase.from('subsections').select('id')

    if (existingSubsections && existingSubsections.length > 0) {
      const subsectionIds = existingSubsections.map((subsection) => subsection.id)
      const { error: deleteSubsectionsError } = await supabase
        .from('subsections')
        .delete()
        .in('id', subsectionIds)

      if (deleteSubsectionsError) {
        console.error('Error eliminando subsecciones:', deleteSubsectionsError)
      }
    }

    const { data: existingSections } = await supabase.from('sections').select('id')

    if (existingSections && existingSections.length > 0) {
      const sectionIds = existingSections.map((section) => section.id)
      const { error: deleteSectionsError } = await supabase
        .from('sections')
        .delete()
        .in('id', sectionIds)

      if (deleteSectionsError) {
        console.error('Error eliminando secciones:', deleteSectionsError)
      }
    }

    console.log('Creando nuevas categorías...')

    for (const [categoryName, subsections] of Object.entries(categoriesWithSubsections)) {
      const slug = toSlug(categoryName)

      const { data: newSection, error: sectionError } = await supabase
        .from('sections')
        .insert({
          name: categoryName,
          slug,
          description: `Catálogo de ${categoryName.toLowerCase()}`,
          order: Object.keys(categoriesWithSubsections).indexOf(categoryName),
          is_active: true,
        })
        .select()
        .single()

      if (sectionError) {
        console.error(`Error creando sección "${categoryName}":`, sectionError)
        continue
      }

      const sectionId = newSection.id
      console.log(`Sección "${categoryName}" creada con ID: ${sectionId}`)

      if (subsections.length > 0) {
        for (const subsectionName of subsections) {
          const subsectionSlug = toSlug(subsectionName)

          const { error: subsectionError } = await supabase
            .from('subsections')
            .insert({
              section_id: sectionId,
              name: subsectionName,
              slug: subsectionSlug,
              description: `${subsectionName} de ${categoryName}`,
              order: subsections.indexOf(subsectionName),
              is_active: true,
            })

          if (subsectionError) {
            console.error(`Error creando subsección "${subsectionName}":`, subsectionError)
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Categorías reseteadas e inicializadas correctamente' })
  } catch (error) {
    console.error('Error reseteando categorías:', error)
    return NextResponse.json({ success: false, message: 'Error reseteando categorías' }, { status: 500 })
  }
}
