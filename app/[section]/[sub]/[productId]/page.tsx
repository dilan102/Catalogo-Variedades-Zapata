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

  const images = useMemo(() => product?.images ?? [], [product])
  const selectedImage = images[0] ?? null
  const otherImages = useMemo(() => images.slice(1), [images])

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

  return (
    <div className="px-4 py-8 sm:py-10 max-w-7xl mx-auto">
      <section className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-[#DCEFDD] bg-white shadow-sm">
          <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-[#FAFCF9]">
            {selectedImage ? (
              <Image src={selectedImage} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
            ) : (
              <ImagePlaceholder className="absolute inset-0" />
            )}
          </div>

          <div className="px-4 pb-4">
            <p className="text-base font-serif font-semibold leading-tight text-[#0F2A1A] line-clamp-2">{product.name}</p>
            {product.description && (
              <p className="mt-3 text-sm leading-6 text-[#5C7A66]">{product.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 4).map((size) => (
                <span key={size} className="rounded-full border border-[#DCEFDD] bg-white px-2 py-1 text-[10px] text-[#0F2A1A]">{size}</span>
              ))}
            </div>
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="rounded-[32px] border border-[#DCEFDD] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0F2A1A]">Otras imágenes</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
      </section>
    </div>
  )
}
