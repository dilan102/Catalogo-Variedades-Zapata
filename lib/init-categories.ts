import { createClient } from '@/utils/supabase/client'

export const categoriesWithSubsections: Record<string, string[]> = {
  'Dama': ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos', 'Conjuntos', 'Faldas', 'Pijama'],
  'Caballero': ['Pantalones', 'Pantalonetas', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Zapatos', 'Ropa interior', 'Ropa deportiva'],
  'Niño': ['Pantalones', 'Zapatos', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Ropa interior'],
  'Niña': ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Zapatos', 'Vestidos', 'Ropa interior', 'Medias'],
  'Accesorios': ['Gafas', 'Relojería', 'Joyería', 'Tecnología'],
  'Edredones': ['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas'],
  'Esika': []
}

export function slugify(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
}

export async function initializeCategories() {
  console.log('Inicializando categorías y subsecciones...')
  
  const supabase = createClient()
  
  // Primero eliminar todas las categorías y subsecciones existentes
  console.log('Eliminando categorías y subsecciones existentes...')
  
  const { error: deleteSubsectionsError } = await supabase
    .from('subsections')
    .delete()
    .not('id', 'is', null)
  
  if (deleteSubsectionsError) {
    console.error('Error eliminando subsecciones:', deleteSubsectionsError)
  } else {
    console.log('Subsecciones eliminadas')
  }
  
  const { error: deleteSectionsError } = await supabase
    .from('sections')
    .delete()
    .not('id', 'is', null)
  
  if (deleteSectionsError) {
    console.error('Error eliminando secciones:', deleteSectionsError)
  } else {
    console.log('Secciones eliminadas')
  }
  
  // Ahora crear las nuevas categorías
  for (const [categoryName, subsections] of Object.entries(categoriesWithSubsections)) {
    // Generar slug para la sección
    const slug = slugify(categoryName)
    
    // Crear nueva sección
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
    
    // Crear subsecciones si la categoría tiene subsecciones
    if (subsections.length > 0) {
      for (const subsectionName of subsections) {
        const subsectionSlug = slugify(subsectionName)
        
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
  
  console.log('Inicialización de categorías completada')
}

// Función para ejecutar desde el navegador
export async function runInitialization() {
  try {
    await initializeCategories()
    return { success: true, message: 'Categorías y subsecciones inicializadas correctamente' }
  } catch (error) {
    console.error('Error durante la inicialización:', error)
    return { success: false, message: 'Error durante la inicialización. Revisa la consola para más detalles.' }
  }
}
