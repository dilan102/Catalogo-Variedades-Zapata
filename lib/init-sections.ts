import { supabase } from './supabase'

const defaultSections = [
  { name: 'Niños', slug: 'ninos', description: 'Ropa y accesorios para niños', order: 1, is_active: true },
  { name: 'Niñas', slug: 'ninas', description: 'Ropa y accesorios para niñas', order: 2, is_active: true },
  { name: 'Damas', slug: 'damas', description: 'Ropa y accesorios para damas', order: 3, is_active: true },
  { name: 'Caballeros', slug: 'caballeros', description: 'Ropa y accesorios para caballeros', order: 4, is_active: true },
  { name: 'Ropa de bebé', slug: 'ropa-de-bebe', description: 'Ropa y accesorios para bebés', order: 5, is_active: true },
  { name: 'Zapatos', slug: 'zapatos', description: 'Calzado para toda la familia', order: 6, is_active: true },
  { name: 'Sección hogar', slug: 'seccion-hogar', description: 'Artículos para el hogar', order: 7, is_active: true },
  { name: 'Esika-lebel', slug: 'esika-lebel', description: 'Productos de belleza Esika y Lebel', order: 8, is_active: true },
  { name: 'Avon', slug: 'avon', description: 'Productos de belleza Avon', order: 9, is_active: true },
]

export async function initDefaultSections() {
  try {
    console.log('Iniciando secciones predeterminadas...')
    
    for (const section of defaultSections) {
      const { data: existing } = await supabase
        .from('sections')
        .select('id')
        .eq('slug', section.slug)
        .single()
      
      if (existing) {
        console.log(`Sección "${section.name}" ya existe, actualizando...`)
        await supabase
          .from('sections')
          .update(section)
          .eq('slug', section.slug)
      } else {
        console.log(`Creando sección "${section.name}"...`)
        await supabase
          .from('sections')
          .insert(section)
      }
    }
    
    console.log('✅ Secciones inicializadas correctamente')
  } catch (error) {
    console.error('❌ Error al inicializar secciones:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDefaultSections()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
