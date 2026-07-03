 'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProductById } from '@/lib/queries'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams() as { section?: string; sub?: string; productId?: string } | null
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    const productId = params?.productId
    if (!productId) return
    setLoading(true)
    setProduct(null)
    void getProductById(productId)
      .then((result) => {
        if (result) setProduct(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params?.productId])

  useEffect(() => {
    void fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setAdminMode(Boolean(data.authenticated)))
      .catch(() => setAdminMode(false))
  }, [])

  if (loading) return <div className="px-4 py-10 text-center text-stone-400 text-sm">Cargando...</div>
  if (!product) return (
    <div className="px-4 py-10 text-center text-stone-400 text-sm">
      <p>Producto no encontrado (id: {params?.productId ?? 'no definido'}). Revisa la consola para más detalles.</p>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            const productId = params?.productId
            if (!productId) return
            setLoading(true)
            void getProductById(productId).then((r) => { if (r) setProduct(r) }).finally(() => setLoading(false))
          }}
          className="inline-flex items-center justify-center rounded-3xl border border-[#DCEFDD] bg-white px-4 py-2 text-sm font-semibold text-[#3E9A60]"
        >Reintentar</button>
      </div>
    </div>
  )

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
          <div className="overflow-hidden rounded-2xl border border-[#DCEFDD] bg-white shadow-sm max-w-sm">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-[#FAFCF9]">
              {selectedImage ? (
                <Image src={selectedImage} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
              ) : (
                <ImagePlaceholder className="absolute inset-0" />
              )}
            </div>

            <div className="px-4 pb-4">
              <p className="text-base font-serif font-semibold leading-tight text-[#0F2A1A] line-clamp-2">{product.name}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.sizes.slice(0, 4).map((size) => (
                  <span key={size} className="rounded-full border border-[#DCEFDD] bg-white px-2 py-1 text-[10px] text-[#0F2A1A]">{size}</span>
                ))}
              </div>
              <div className="mt-4 text-sm text-[#5C7A66]">
                <p><span className="font-semibold text-[#0F2A1A]">Sección:</span> {product.subsection?.section?.name || params?.section}</p>
                <p><span className="font-semibold text-[#0F2A1A]">Subsección:</span> {product.subsection?.name || params?.sub}</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-[#DCEFDD] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0F2A1A]">Información</p>
            <div className="mt-4 space-y-3 text-sm text-[#5C7A66]">
              <p><span className="font-semibold text-[#0F2A1A]">Sección:</span> {product.subsection?.section?.name || params?.section}</p>
              <p><span className="font-semibold text-[#0F2A1A]">Subsección:</span> {product.subsection?.name || params?.sub}</p>
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
