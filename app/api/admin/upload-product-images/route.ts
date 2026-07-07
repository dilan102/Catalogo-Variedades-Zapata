import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requireAdminSession } from '@/lib/requireAdmin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucketName = 'product-images'

function sanitizeFileName(value: string) {
  return value
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
    .toLowerCase()
}

async function ensureBucketExists(supabase: any) {
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
  })

  if (error) {
    const message = String(error?.message ?? '')
    const alreadyExists = error.status === 409 || /already exists|resource already exists|duplicate/i.test(message)
    if (!alreadyExists) {
      throw new Error(message || 'No se pudo preparar el bucket de imágenes')
    }
  }
}

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

  let payload: { sectionSlug?: string; fileName?: string; contentType?: string } | null = null

  try {
    payload = await request.json()
  } catch {
    payload = null
  }

  const sectionSlug = payload?.sectionSlug
  const fileName = payload?.fileName
  const contentType = payload?.contentType

  if (typeof sectionSlug !== 'string' || !sectionSlug) {
    return NextResponse.json({ success: false, message: 'Falta sección' }, { status: 400 })
  }

  if (typeof fileName !== 'string' || !fileName) {
    return NextResponse.json({ success: false, message: 'Falta el nombre del archivo' }, { status: 400 })
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    await ensureBucketExists(supabase)

    const sanitizedName = `${crypto.randomUUID()}-${sanitizeFileName(fileName)}`
    const filePath = `${sectionSlug}/${sanitizedName}`

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(filePath, { upsert: false })

    if (error || !data?.signedUrl || !data?.token) {
      console.error('Supabase signed upload URL error:', error)
      return NextResponse.json({ success: false, message: 'No se pudo preparar la subida' }, { status: 500 })
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      publicUrl,
      contentType: contentType || 'application/octet-stream',
    })
  } catch (error) {
    console.error('Error en upload-product-images:', error)
    const message = error instanceof Error ? error.message : 'Error al subir las imágenes'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
