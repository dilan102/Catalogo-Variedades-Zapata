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

type UploadFile = File | (Blob & { name: string })

function isUploadFile(value: unknown): value is UploadFile {
  return (
    value instanceof File ||
    (typeof value === 'object' && value !== null && 'name' in value && 'arrayBuffer' in value)
  )
}

async function ensureBucketExists(supabase: any) {
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
  })

  if (error && error.status !== 409) {
    throw error
  }
}

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

  const formData = await request.formData()
  const sectionSlug = formData.get('sectionSlug')
  const primaryFile = formData.get('primaryImage')
  const otherFiles = formData.getAll('otherImages')

  if (typeof sectionSlug !== 'string' || !sectionSlug) {
    return NextResponse.json({ success: false, message: 'Falta sección' }, { status: 400 })
  }

  const validatedPrimaryFile = isUploadFile(primaryFile) ? primaryFile : null
  if (!validatedPrimaryFile) {
    return NextResponse.json({ success: false, message: 'La foto principal es obligatoria' }, { status: 400 })
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    await ensureBucketExists(supabase)

    const uploadedUrls: string[] = []
    const filesToUpload: UploadFile[] = [
      validatedPrimaryFile,
      ...otherFiles.filter(isUploadFile)
    ]

    for (const file of filesToUpload) {
      const name = 'name' in file && typeof file.name === 'string' ? file.name : `upload-${crypto.randomUUID()}`
      const fileName = `${crypto.randomUUID()}-${sanitizeFileName(name)}`
      const filePath = `${sectionSlug}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        return NextResponse.json({ success: false, message: uploadError.message }, { status: 500 })
      }

      const publicUrlResponse: any = await supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      const publicUrlData = publicUrlResponse?.data

      if (!publicUrlData?.publicUrl) {
        console.error('Supabase public URL error:', publicUrlResponse)
        return NextResponse.json({ success: false, message: 'No se pudo obtener la URL pública' }, { status: 500 })
      }

      uploadedUrls.push(publicUrlData.publicUrl)
    }

    return NextResponse.json({ success: true, urls: uploadedUrls })
  } catch (error) {
    console.error('Error en upload-product-images:', error)
    return NextResponse.json({ success: false, message: 'Error al subir las imágenes' }, { status: 500 })
  }
}
