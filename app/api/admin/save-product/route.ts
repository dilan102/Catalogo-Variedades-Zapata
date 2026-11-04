import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requireAdminSession } from '@/lib/requireAdmin'
import type { Product } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  if (!await requireAdminSession(request)) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { success: false, message: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const price = body.price === '' || body.price === null || body.price === undefined ? null : Number(body.price)
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json({ success: false, message: 'El precio no es válido' }, { status: 400 })
    }
    const productData: Partial<Product> = {
      id: body.id,
      subsection_id: body.subsection_id,
      name: body.name,
      description: body.description,
      price,
      images: body.images,
      sizes: body.sizes,
      colors: body.colors,
      is_active: body.is_active,
      is_featured: body.is_featured,
      order: body.order,
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })

    const { data, error } = await supabase.from('products').upsert(productData).select().single()

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, message: 'No se pudo guardar el producto' }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error('Error en save-product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al guardar el producto'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
