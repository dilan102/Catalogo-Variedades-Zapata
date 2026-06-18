'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProductById } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  params: { section: string; sub: string; productId: string }
}

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => {
    getProductById(params.productId).then(setProduct)
  }, [params.productId])

  if (!product) {
    return (
      <div className="px-4 py-10 text-center text-stone-400 text-sm">
        Cargando producto...
      </div>
    )
  }

  const images = product.images?.length ? product.images : []
  const subsection = (product as any).subsection
  const section = subsection?.section

  return (
    <div>
      {/* Galería de imágenes */}
      <div className="relative bg-stone-100">
        <div className="aspect-[4/5] relative overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[imgIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* Navegación galería */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === imgIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === imgIndex ? 'border-stone-800' : 'border-transparent'
                }`}
              >
                <Image src={img} alt="" width={56} height={56} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info del producto */}
      <div className="px-4 py-5">
        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 mb-2">
          {section && <Link href={`/${section.slug}`} className="underline">{section.name}</Link>}
          {subsection && <> / <Link href={`/${section?.slug}/${subsection.slug}`} className="underline">{subsection.name}</Link></>}
        </p>

        <h1 className="text-xl font-bold text-stone-900 leading-tight">{product.name}</h1>

        {product.price !== null && (
          <p className="text-lg font-semibold text-stone-700 mt-1">{formatPrice(product.price)}</p>
        )}

        {product.description && (
          <p className="text-sm text-stone-500 mt-3 leading-relaxed">{product.description}</p>
        )}

        {/* Tallas */}
        {product.sizes.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Talla</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                  className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                    selectedSize === s
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colores */}
        {product.colors.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c === selectedColor ? null : c)}
                  className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                    selectedColor === c
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón de contacto */}
        <div className="mt-6 space-y-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hola, me interesa: ${product.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white font-semibold rounded-xl text-sm active:bg-green-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Consultar por WhatsApp
          </a>

          <Link
            href={`/${params.section}/${params.sub}`}
            className="flex items-center justify-center w-full py-3 border border-stone-200 text-stone-600 font-medium rounded-xl text-sm"
          >
            Volver a {subsection?.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
