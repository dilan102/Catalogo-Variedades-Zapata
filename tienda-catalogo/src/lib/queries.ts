import { supabase } from './supabase'
import type { Section, Subsection, Product } from '@/types'

// ─── SECCIONES ───────────────────────────────────────────────

export async function getSections(): Promise<Section[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('is_active', true)
    .order('order')
  if (error) throw error
  return data ?? []
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('*, subsections(*, products(*))')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data
}

export async function getAllSectionsAdmin(): Promise<Section[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('order')
  if (error) throw error
  return data ?? []
}

export async function upsertSection(section: Partial<Section>): Promise<Section> {
  const { data, error } = await supabase
    .from('sections')
    .upsert(section)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('sections').delete().eq('id', id)
  if (error) throw error
}

// ─── SUBSECCIONES ─────────────────────────────────────────────

export async function getSubsectionsBySection(sectionId: string): Promise<Subsection[]> {
  const { data, error } = await supabase
    .from('subsections')
    .select('*')
    .eq('section_id', sectionId)
    .eq('is_active', true)
    .order('order')
  if (error) throw error
  return data ?? []
}

export async function getSubsectionBySlug(sectionSlug: string, subSlug: string): Promise<Subsection | null> {
  const { data: section } = await supabase
    .from('sections')
    .select('id')
    .eq('slug', sectionSlug)
    .single()
  if (!section) return null

  const { data, error } = await supabase
    .from('subsections')
    .select('*, section:sections(*)')
    .eq('section_id', section.id)
    .eq('slug', subSlug)
    .single()
  if (error) return null
  return data
}

export async function getAllSubsectionsAdmin(): Promise<Subsection[]> {
  const { data, error } = await supabase
    .from('subsections')
    .select('*, section:sections(name, slug)')
    .order('order')
  if (error) throw error
  return data ?? []
}

export async function upsertSubsection(sub: Partial<Subsection>): Promise<Subsection> {
  const { data, error } = await supabase
    .from('subsections')
    .upsert(sub)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSubsection(id: string): Promise<void> {
  const { error } = await supabase.from('subsections').delete().eq('id', id)
  if (error) throw error
}

// ─── PRODUCTOS ────────────────────────────────────────────────

export async function getProductsBySubsection(subsectionId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('subsection_id', subsectionId)
    .eq('is_active', true)
    .order('order')
  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, subsection:subsections(*, section:sections(*))')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, subsection:subsections(slug, name, section:sections(slug, name))')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('order')
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, subsection:subsections(name, section:sections(name))')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function upsertProduct(product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .upsert(product)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ─── STORAGE (imágenes) ──────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from('catalog-images')
    .upload(path, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage
    .from('catalog-images')
    .getPublicUrl(path)
  return data.publicUrl
}
