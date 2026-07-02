'use client'
import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getSubsectionBySlug, getProductsBySubsection, upsertProduct } from '@/lib/queries'
import ProductCard from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import type { Subsection, Product } from '@/types'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function SubsectionPage({ params }: { params: Promise<{ section: string; sub: string }> }) {
  const { section: sectionSlug, sub: subSlug } = use(params)
  const [subsection, setSubsection] = useState<Subsection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    primaryImage: '',
    otherImages: '',
    sizes: [] as string[],
    colors: '',
    is_active: true,
    is_featured: false,
    order: 0,
  })

  useEffect(() => {
    getSubsectionBySlug(sectionSlug, subSlug).then(async (sub) => {
      setSubsection(sub)
      if (sub) setProducts(await getProductsBySubsection(sub.id))
    }).finally(() => setLoading(false))
  }, [sectionSlug, subSlug])

  useEffect(() => {
    void fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setAdminMode(Boolean(data.authenticated)))
      .catch(() => setAdminMode(false))
  }, [])

  const section = subsection?.section

  const selectedSizes = useMemo(() => new Set(formState.sizes), [formState.sizes])

  const toggleSize = (size: string) => {
    setFormState((current) => {
      const sizes = current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size]
      return { ...current, sizes }
    })
  }

  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      price: '',
      primaryImage: '',
      otherImages: '',
      sizes: [],
      colors: '',
      is_active: true,
      is_featured: false,
      order: products.length,
    })
    setErrorMessage('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!subsection) return

    const primaryImage = formState.primaryImage.trim()
    const additionalImages = formState.otherImages
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)

    if (!primaryImage) {
      setErrorMessage('La foto principal es obligatoria.')
      return
    }

    const images = [primaryImage, ...additionalImages]
    const colors = formState.colors
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    try {
      setLoading(true)
      await upsertProduct({
        subsection_id: subsection.id,
        name: formState.name,
        description: formState.description || null,
        price: formState.price ? Number(formState.price) : null,
        images,
        sizes: formState.sizes,
        colors,
        is_active: formState.is_active,
        is_featured: formState.is_featured,
        order: Number(formState.order) || products.length,
      })
      const refreshedProducts = await getProductsBySubsection(subsection.id)
      setProducts(refreshedProducts)
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error guardando producto:', error)
      setErrorMessage('No se pudo guardar el producto. Revisa los datos e intenta de nuevo.')
    } finally {
      setLoading(false)
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
          <h2 className="text-lg font-semibold text-[#0F2A1A] mb-4">Agregar producto a {subsection?.name}</h2>
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
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Precio</span>
                <input
                  type="number"
                  step="0.01"
                  value={formState.price}
                  onChange={(event) => setFormState({ ...formState, price: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                  placeholder="Ej: 49.99"
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
                  value={formState.primaryImage}
                  onChange={(event) => setFormState({ ...formState, primaryImage: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                  placeholder="URL de la foto principal"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Fotos de otros colores/estilos</span>
                <textarea
                  value={formState.otherImages}
                  onChange={(event) => setFormState({ ...formState, otherImages: event.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded-3xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                  placeholder="Una URL por línea"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <span className="text-sm font-medium text-[#0F2A1A]">Tallas disponibles</span>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => (
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
              <label className="block">
                <span className="text-sm font-medium text-[#0F2A1A]">Colores</span>
                <input
                  value={formState.colors}
                  onChange={(event) => setFormState({ ...formState, colors: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none transition focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"
                  placeholder="Ej: Rojo, Azul, Verde"
                />
              </label>
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

            {errorMessage && <p className="text-sm text-[#B12A1B]">{errorMessage}</p>}
          </form>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-slide-up">
                <ProductCard product={p} href={`/${sectionSlug}/${subSlug}/${p.id}`} />
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
