import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requireAdminSession } from '@/lib/requireAdmin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucketName = 'product-images'

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
    const paths = Array.isArray(body?.paths) ? body.paths.filter((item: unknown) => typeof item === 'string') : []

    if (paths.length === 0) {
      return NextResponse.json({ success: false, message: 'No se proporcionaron rutas de archivos' }, { status: 400 })
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.storage.from(bucketName).remove(paths)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en delete-product-images:', error)
    return NextResponse.json({ success: false, message: 'Error al eliminar las imágenes' }, { status: 500 })
  }
}
