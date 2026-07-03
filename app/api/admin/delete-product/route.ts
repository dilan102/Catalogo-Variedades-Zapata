import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requireAdminSession } from '@/lib/requireAdmin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  if (!await requireAdminSession()) {
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
    const productId = body?.id

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ success: false, message: 'ID de producto requerido' }, { status: 400 })
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.from('products').delete().eq('id', productId)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en delete-product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el producto'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
