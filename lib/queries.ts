import { createClient } from '@/utils/supabase/client'
import type { Section, Subsection, Product } from '@/types'

export async function getSections(): Promise<Section[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('sections').select('*').eq('is_active', true).order('order')
    if (error) throw new Error(`Error al cargar secciones: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getSections:', error)
    throw error
  }
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  try {
    const supabase = createClient()
    const { data: section, error: sectionError } = await supabase.from('sections').select('*').eq('slug', slug).eq('is_active', true).single()
    if (sectionError || !section) {
      console.error('Supabase error loading section:', sectionError)
      return null
    }
    
    const { data: subsections, error: subsectionsError } = await supabase.from('subsections').select('*').eq('section_id', section.id).order('order')
    if (subsectionsError) {
      console.error('Supabase error loading subsections:', subsectionsError)
    }
    
    const sectionWithSubsections = { ...section, subsections: subsections ?? [] }
    return sectionWithSubsections
  } catch (error) {
    console.error('Error in getSectionBySlug:', error)
    return null
  }
}

export async function getAllSectionsAdmin(): Promise<Section[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('sections').select('*').order('order')
    if (error) throw new Error(`Error al cargar secciones: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getAllSectionsAdmin:', error)
    throw error
  }
}

export async function upsertSection(section: Partial<Section>): Promise<Section> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('sections').upsert(section).select().single()
    if (error) throw new Error(`Error al guardar sección: ${error.message}`)
    if (!data) throw new Error('No se pudo guardar la sección')
    return data
  } catch (error) {
    console.error('Error in upsertSection:', error)
    throw error
  }
}

export async function deleteSection(id: string): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('sections').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar sección: ${error.message}`)
  } catch (error) {
    console.error('Error in deleteSection:', error)
    throw error
  }
}

export async function getSubsectionsBySection(sectionId: string): Promise<Subsection[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('subsections').select('*').eq('section_id', sectionId).eq('is_active', true).order('order')
    if (error) throw new Error(`Error al cargar subsecciones: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getSubsectionsBySection:', error)
    throw error
  }
}

export async function getSubsectionBySlug(sectionSlug: string, subSlug: string): Promise<Subsection | null> {
  try {
    const supabase = createClient()
    const { data: section, error: sectionError } = await supabase.from('sections').select('id').eq('slug', sectionSlug).single()
    if (sectionError || !section) return null
    const { data, error } = await supabase.from('subsections').select('*, section:sections(*)').eq('section_id', section.id).eq('slug', subSlug).single()
    if (error) return null
    return data
  } catch (error) {
    console.error('Error in getSubsectionBySlug:', error)
    return null
  }
}

export async function getAllSubsectionsAdmin(): Promise<Subsection[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('subsections').select('*, section:sections(name, slug)').order('order')
    if (error) throw new Error(`Error al cargar subsecciones: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getAllSubsectionsAdmin:', error)
    throw error
  }
}

export async function upsertSubsection(sub: Partial<Subsection>): Promise<Subsection> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('subsections').upsert(sub).select().single()
    if (error) throw new Error(`Error al guardar subsección: ${error.message}`)
    if (!data) throw new Error('No se pudo guardar la subsección')
    return data
  } catch (error) {
    console.error('Error in upsertSubsection:', error)
    throw error
  }
}

export async function deleteSubsection(id: string): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('subsections').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar subsección: ${error.message}`)
  } catch (error) {
    console.error('Error in deleteSubsection:', error)
    throw error
  }
}

export async function getProductsBySubsection(subsectionId: string): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*').eq('subsection_id', subsectionId).eq('is_active', true).order('order')
    if (error) throw new Error(`Error al cargar productos: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getProductsBySubsection:', error)
    throw error
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*, subsection:subsections(*, section:sections(*))').eq('id', id).single()
    if (error) return null
    return data
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*, subsection:subsections(slug, name, section:sections(slug, name))').eq('is_featured', true).eq('is_active', true).order('order').limit(limit)
    if (error) throw new Error(`Error al cargar productos destacados: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    throw error
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*, subsection:subsections(name, section:sections(name))').order('created_at', { ascending: false })
    if (error) throw new Error(`Error al cargar productos: ${error.message}`)
    return data ?? []
  } catch (error) {
    console.error('Error in getAllProductsAdmin:', error)
    throw error
  }
}

export async function upsertProduct(product: Partial<Product>): Promise<Product> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').upsert(product).select().single()
    if (error) throw new Error(`Error al guardar producto: ${error.message}`)
    if (!data) throw new Error('No se pudo guardar el producto')
    return data
  } catch (error) {
    console.error('Error in upsertProduct:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar producto: ${error.message}`)
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    throw error
  }
}
