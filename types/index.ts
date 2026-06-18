export interface Section {
  id: string; name: string; slug: string; description: string | null
  image_url: string | null; order: number; is_active: boolean; created_at: string
  subsections?: Subsection[]
}
export interface Subsection {
  id: string; section_id: string; name: string; slug: string
  description: string | null; image_url: string | null; order: number
  is_active: boolean; created_at: string; section?: Section; products?: Product[]
}
export interface Product {
  id: string; subsection_id: string; name: string; description: string | null
  price: number | null; images: string[]; sizes: string[]; colors: string[]
  is_active: boolean; is_featured: boolean; order: number; created_at: string
  subsection?: Subsection
}
