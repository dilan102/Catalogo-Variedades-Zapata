 'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getSubsectionBySlug, getProductsBySubsection } from '@/lib/queries'
import { getAvailableSizes } from '@/lib/sizes'
import ProductCard from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import { parseJsonResponse } from '@/lib/utils'
import type { Subsection, Product } from '@/types'

export default function SubsectionPage({ params }: { params: Promise<{ section: string; sub: string }> }) {
  const [sectionSlug, setSectionSlug] = useState<string>('')
  const [subSlug, setSubSlug] = useState<string>('')
  const [subsection, setSubsection] = useState<Subsection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null)
  const [otherImageFiles, setOtherImageFiles] = useState<File[]>([])
  const [primaryPreview, setPrimaryPreview] = useState('')
  const [otherPreviews, setOtherPreviews] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    sizes: [] as string[],
    colors: '',
    is_active: true,
    is_featured: false,
    order: 0,
  })

  const parseSupabaseImagePath = (url: string) => {
    const marker = '/object/public/product-images/'
    const index = url.indexOf(marker)
    if (index === -1) return null
    return url.substring(index + marker.length)
  }

  useEffect(() => {
    params.then((resolved) => {
      setSectionSlug(resolved.section)
      setSubSlug(resolved.sub)
    })
  }, [params])

  useEffect(() => {
    if (!sectionSlug || !subSlug) return
    setLoading(true)
    getSubsectionBySlug(sectionSlug, subSlug).then(async (sub) => {
      setSubsection(sub)
      if (sub) {
        const prods = await getProductsBySubsection(sub.id)
        setProducts(prods)
      }
    }).finally(() => setLoading(false))
  }, [sectionSlug, subSlug])

  useEffect(() => {
    void fetch('/api/me')
      .then((res) => parseJsonResponse<{ authenticated?: boolean }>(res))
      .then((data) => setAdminMode(Boolean(data.authenticated)))
      .catch(() => setAdminMode(false))
  }, [])

  const section = subsection?.section

  const availableSizes = useMemo(
    () => getAvailableSizes(section?.slug ?? '', subsection?.slug ?? ''),
    [section?.slug, subsection?.slug]
  )

  const selectedSizes = useMemo(() => new Set(formState.sizes), [formState.sizes])

  useEffect(() => {
    return () => {
      if (primaryPreview) {
        URL.revokeObjectURL(primaryPreview)
      }
      otherPreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [primaryPreview, otherPreviews])

  const toggleSize = (size: string) => {
    setFormState((current) => {
      const sizes = current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size]
      return { ...current, sizes }
    })
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormState({
      name: '',
      description: '',
      sizes: [],
      colors: '',
      is_active: true,
      is_featured: false,
      order: products.length,
    })
    setPrimaryImageFile(null)
    setOtherImageFiles([])
    setPrimaryPreview('')
    setOtherPreviews([])
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormState({
      name: product.name,
      description: product.description ?? '',
      sizes: product.sizes ?? [] ,
      colors: product.colors.join(', '),
      is_active: product.is_active,
      is_featured: product.is_featured,
      order: product.order ?? products.length,
    })
    setPrimaryImageFile(null)
    setOtherImageFiles([])
    setPrimaryPreview('')
    setOtherPreviews([])
    setErrorMessage('')
    setSuccessMessage('')
    setShowForm(true)
  }

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm('¿Eliminar este producto y sus imágenes? Esta acción no se puede deshacer.')
    if (!confirmed) return

    try {
      setLoading(true)
      setErrorMessage('')
      setSuccessMessage('')

      const imagePaths = (product.images ?? [])
        .map((url) => parseSupabaseImagePath(url))
        .filter((path): path is string => Boolean(path))

      if (imagePaths.length > 0) {
        const deleteImagesResponse = await fetch('/api/admin/delete-product-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: imagePaths }),
        })

        await parseJsonResponse(deleteImagesResponse)
      }

      const deleteResponse = await fetch('/api/admin/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      })

      const deleteResult = await parseJsonResponse<{ success: boolean; message?: string }>(deleteResponse)

      if (!deleteResponse.ok || !deleteResult.success) {
        console.error('Error eliminando producto:', deleteResult)
        setErrorMessage(deleteResult?.message || 'No se pudo eliminar el producto. Intenta de nuevo.')
        return
      }

      setProducts((current) => current.filter((item) => item.id !== product.id))
      setSuccessMessage('Producto eliminado correctamente.')
      if (editingProduct?.id === product.id) {
        resetForm()
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
      const errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar el producto. Intenta de nuevo.'
      setErrorMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!subsection) return

    const colors = formState.colors
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    let images = editingProduct?.images ?? []
    const hasNewImages = Boolean(primaryImageFile) || otherImageFiles.length > 0

    if (!editingProduct && !primaryImageFile) {
      setErrorMessage('La foto principal es obligatoria.')
      return
    }

    if (hasNewImages && !primaryImageFile) {
      setErrorMessage('La foto principal es obligatoria cuando subes nuevas imágenes.')
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      setLoading(true)
      setIsUploadingImages(hasNewImages)

      if (hasNewImages) {
        const uploadFiles = [
          ...(primaryImageFile ? [primaryImageFile] : []),
          ...otherImageFiles,
        ]

        const uploadedUrls: string[] = []

        for (const file of uploadFiles) {
          const uploadResponse = await fetch('/api/admin/upload-product-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sectionSlug,
              fileName: file.name,
              contentType: file.type || 'application/octet-stream',
            }),
          })

          const uploadResult = await parseJsonResponse<{
            success: boolean
            message?: string
            signedUrl?: string
            publicUrl?: string
          }>(uploadResponse)

          if (!uploadResponse.ok || !uploadResult.success || !uploadResult.signedUrl || !uploadResult.publicUrl) {
            console.error('Error preparando subida de imagen:', uploadResult)
            setErrorMessage(uploadResult?.message || 'Error subiendo las imágenes.')
            return
          }

          const directUploadResponse = await fetch(uploadResult.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file,
          })

          if (!directUploadResponse.ok) {
            const directUploadText = await directUploadResponse.text().catch(() => '')
            console.error('Error subiendo imagen a Supabase:', directUploadText)
            setErrorMessage('No se pudo cargar una de las imágenes.')
            return
          }

          uploadedUrls.push(uploadResult.publicUrl)
        }

        images = uploadedUrls
      }

      const saveResponse = await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct?.id,
          subsection_id: subsection.id,
          name: formState.name,
          description: formState.description || null,
          images,
          sizes: formState.sizes,
          colors,
          is_active: formState.is_active,
          is_featured: formState.is_featured,
          order: Number(formState.order) || products.length,
        }),
      })

      const saveResult = await parseJsonResponse<{ success: boolean; message?: string }>(saveResponse)

      if (!saveResponse.ok || !saveResult.success) {
        console.error('Error guardando producto:', saveResult)
        setErrorMessage(saveResult?.message || 'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.')
        return
      }

      const refreshedProducts = await getProductsBySubsection(subsection.id)
      setProducts(refreshedProducts)
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error guardando producto:', error)
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.'
      setErrorMessage(errorMessage)
    } finally {
      setLoading(false)
      setIsUploadingImages(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      <p className="text-xs text-[#5C7A66] mb-2 animate-fade-in">
        <Link href="/" className="underline hover:text-[#3E9A60] transition-colors">Inicio</Link>
        {' / '}
        <Link href={`/${sectionSlug}`} className="underline hover:text-[#3E9A60] transition-colors">{section?.name ?? sectionSlug}</Link>
        {' / '}
        {subsection?.name}
      </p>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A1A]">{subsection?.name ?? '...'}</h1>
          {adminMode && <p className="mt-2 text-sm text-[#3E9A60]">Modo administrador activo: puedes agregar productos directamente en esta subsección.</p>}
        </div>
        <div className="flex items-center gap-3">
          {!loading && <span className="text-sm text-[#5C7A66]">{products.length} productos</span>}
          {adminMode && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm((current) => !current)
              }}
              className="rounded-full bg-[#3E9A60] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F7A53]"
            >
              {showForm ? 'Cerrar formulario' : 'Agregar producto'}
            </button>
          )}
        </div>
      </div>

      {adminMode && showForm && (
        <section className="mb-8 rounded-3xl border border-[#D6E7D9] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F2A1A] mb-4">{editingProduct ? 'Editar producto' : 'Agregar producto'} a {subsection?.name}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Nombre del producto</span>
                <input
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                  placeholder="Ej: Blusa deportiva"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-[#0F2A1A]">Descripción</span>
              <textarea
                value={formState.description}
                onChange={(event) => setFormState({ ...formState, description: event.target.value })}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                placeholder="Describe las características del producto"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Foto principal</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    setPrimaryImageFile(file)
                    setPrimaryPreview(file ? URL.createObjectURL(file) : '')
                  }}
                  {...(!editingProduct ? { required: true } : {})}
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                />
                {editingProduct && (
                  <p className="mt-2 text-xs text-[#5C7A66]">Deja este campo vacío para conservar las imágenes actuales.</p>
                )}
                {primaryPreview && (
                  <div className="mt-3 rounded-3xl overflow-hidden border border-[#E4E8E3] bg-[#F7F9F6]">
                    <img src={primaryPreview} alt="Preview foto principal" className="w-full h-52 object-cover" />
                  </div>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Fotos de otros colores/estilos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? [])
                    setOtherImageFiles(files)
                    setOtherPreviews(files.map((file) => URL.createObjectURL(file)))
                  }}
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                />
                {otherPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {otherPreviews.map((preview, index) => (
                      <div key={preview} className="overflow-hidden rounded-3xl border border-[#E4E8E3] bg-[#F7F9F6]">
                        <img src={preview} alt={`Preview adicional ${index + 1}`} className="w-full h-28 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            {isUploadingImages && (
              <p className="text-sm text-[#3E9A60]">Subiendo imagen...</p>
            )}

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              {availableSizes.length > 0 && (
                <div className="space-y-3">
                  <span className="text-sm font-medium text-[#0F2A1A]">Tallas disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <label key={size} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition hover:border-[#3E9A60]">
                        <input
                          type="checkbox"
                          checked={selectedSizes.has(size)}
                          onChange={() => toggleSize(size)}
                          className="h-4 w-4 rounded border-[#BCCFBC] text-[#3E9A60] focus:ring-[#3E9A60]"
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-[#0F2A1A]">
                  <input
                    type="checkbox"
                    checked={formState.is_active}
                    onChange={(event) => setFormState({ ...formState, is_active: event.target.checked })}
                    className="h-4 w-4 rounded border-[#BCCFBC] text-[#3E9A60] focus:ring-[#3E9A60]"
                  />
                  Producto activo
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-[#0F2A1A]">
                  <input
                    type="checkbox"
                    checked={formState.is_featured}
                    onChange={(event) => setFormState({ ...formState, is_featured: event.target.checked })}
                    className="h-4 w-4 rounded border-[#BCCFBC] text-[#3E9A60] focus:ring-[#3E9A60]"
                  />
                  Destacado
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#3E9A60] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2F7A53]"
              >
                Guardar producto
              </button>
            </div>

            {successMessage && <p className="text-sm text-[#1F6B3C]">{successMessage}</p>}
            {errorMessage && <p className="text-sm text-[#B12A1B]">{errorMessage}</p>}
          </form>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-slide-up">
                <ProductCard
                  product={p}
                  href={`/${sectionSlug}/${subSlug}/${p.id}`}
                  adminMode={adminMode}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            ))
        }
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center py-24 text-[#5C7A66] text-base animate-fade-in">No hay productos aún.</p>
      )}
    </div>
  )
}
