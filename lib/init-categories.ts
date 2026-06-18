import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

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

export async function initializeCategories() {
  console.log('Inicializando categorías y subsecciones...')
  
  for (const [categoryName, subsections] of Object.entries(categoriesWithSubsections)) {
    // Generar slug para la sección
    const slug = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
    
    // Verificar si la sección ya existe
    const { data: existingSection } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', slug)
      .single()
    
    let sectionId: string
    
    if (existingSection) {
      sectionId = existingSection.id
      console.log(`Sección "${categoryName}" ya existe, actualizando...`)
      
      // Actualizar sección
      await supabase
        .from('sections')
        .update({ name: categoryName, slug })
        .eq('id', sectionId)
    } else {
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
      
      sectionId = newSection.id
      console.log(`Sección "${categoryName}" creada con ID: ${sectionId}`)
    }
    
    // Crear subsecciones si la categoría tiene subsecciones
    if (subsections.length > 0) {
      for (const subsectionName of subsections) {
        const subsectionSlug = subsectionName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
        
        // Verificar si la subsección ya existe
        const { data: existingSubsection } = await supabase
          .from('subsections')
          .select('id')
          .eq('slug', subsectionSlug)
          .eq('section_id', sectionId)
          .single()
        
        if (!existingSubsection) {
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
        } else {
          console.log(`Subsección "${subsectionName}" ya existe para "${categoryName}"`)
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
