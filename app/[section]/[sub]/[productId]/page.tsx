'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProductById } from '@/lib/queries'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

export default function ProductPage({ params }: { params: { section: string; sub: string; productId: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    void getProductById(params.productId)
      .then((result) => {
        if (result) setProduct(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.productId])

  useEffect(() => {
    void fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setAdminMode(Boolean(data.authenticated)))
      .catch(() => setAdminMode(false))
  }, [])

  if (loading) return <div className="px-4 py-10 text-center text-stone-400 text-sm">Cargando...</div>
  if (!product) return <div className="px-4 py-10 text-center text-stone-400 text-sm">Producto no encontrado</div>

  const images = product.images ?? []
  const subsection = product.subsection
  const section = subsection?.section
  const selectedImage = images[0] ?? null
  const otherImages = useMemo(() => images.slice(1), [images])

  return (
    <div className="px-4 py-8 sm:py-10 max-w-7xl mx-auto">
      <p className="text-xs text-[#5C7A66] mb-2">
        <Link href="/" className="underline hover:text-[#3E9A60] transition-colors">Inicio</Link>
        {' / '}
        {section && <Link href={`/${section.slug}`} className="underline hover:text-[#3E9A60] transition-colors">{section.name}</Link>}
        {' / '}
        {subsection && <Link href={`/${section?.slug}/${subsection.slug}`} className="underline hover:text-[#3E9A60] transition-colors">{subsection.name}</Link>}
        {' / '}
        {product.name}
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-[#DCEFDD] bg-white shadow-sm">
            <div className="relative w-full max-w-md mx-auto aspect-square sm:aspect-[4/5] overflow-hidden rounded-[32px] bg-[#F8FBF7]">
              {selectedImage ? (
                <Image src={selectedImage} alt={product.name} fill className="object-contain" sizes="(max-width: 640px) 80vw, 480px" />
              ) : (
                <ImagePlaceholder className="absolute inset-0" />
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#DCEFDD] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#0F2A1A]">{product.name}</h1>
              </div>
              {product.is_featured && (
                <span className="inline-flex rounded-full border border-[#6FCB8C] bg-[#ECF9EE] px-4 py-2 text-sm font-semibold text-[#1F6B3C]">Destacado</span>
              )}
            </div>

            {product.description && <p className="mt-6 text-sm leading-7 text-[#334D41]">{product.description}</p>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#F4FBF5] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#5C7A66]">Tallas</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.sizes.length > 0 ? product.sizes.map((size) => (
                    <span key={size} className="rounded-full border border-[#CDE8D2] bg-white px-3 py-2 text-sm text-[#0F2A1A]">{size}</span>
                  )) : <span className="text-sm text-[#5C7A66]">Sin tallas definidas</span>}
                </div>
              </div>
              <div className="rounded-3xl bg-[#F4FBF5] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#5C7A66]">Colores</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.colors.length > 0 ? product.colors.map((color) => (
                    <button key={color} type="button" onClick={() => setSelectedColor(color === selectedColor ? null : color)} className={`rounded-full border px-3 py-2 text-sm transition ${selectedColor === color ? 'border-[#1F6B3C] bg-[#1F6B3C] text-white shadow-sm' : 'border-[#DCEFDD] bg-white text-[#0F2A1A] hover:border-[#3E9A60]'}`}>{color}</button>
                  )) : <span className="text-sm text-[#5C7A66]">Sin variantes</span>}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href={`https://wa.me/?text=${encodeURIComponent(`Hola, me interesa: ${product.name}`)}`} className="inline-flex items-center justify-center rounded-3xl bg-[#3E9A60] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1F6B3C]">Consultar por WhatsApp</Link>
              <Link href={`/${params.section}/${params.sub}`} className="inline-flex items-center justify-center rounded-3xl border border-[#DCEFDD] bg-white px-5 py-4 text-sm font-semibold text-[#3E9A60] transition hover:bg-[#EAF8EC]">Volver a la subsección</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-[#DCEFDD] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0F2A1A]">Información</p>
            <div className="mt-4 space-y-3 text-sm text-[#5C7A66]">
              <p><span className="font-semibold text-[#0F2A1A]">Sección:</span> {product.subsection?.section?.name || params.section}</p>
              <p><span className="font-semibold text-[#0F2A1A]">Subsección:</span> {product.subsection?.name || params.sub}</p>
              <p><span className="font-semibold text-[#0F2A1A]">Estado:</span> {product.is_active ? 'Activo' : 'No activo'}</p>
              <p><span className="font-semibold text-[#0F2A1A]">Orden:</span> {product.order}</p>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="rounded-[32px] border border-[#DCEFDD] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#0F2A1A]">Otros colores / estilos</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {otherImages.map((src, index) => (
                  <button key={`${src}-${index}`} type="button" onClick={() => window.open(src, '_blank', 'noopener')} className="overflow-hidden rounded-3xl border border-[#E4E8E3] bg-[#F8FBF7] focus:outline-none">
                    <div className="relative h-32 w-full">
                      <Image src={src} alt={`${product.name} variante ${index + 2}`} fill className="object-cover" sizes="220px" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
