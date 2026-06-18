'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProductById } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductPage({ params }: { params: { section: string; sub: string; productId: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => { getProductById(params.productId).then(setProduct) }, [params.productId])

  if (!product) return <div className="px-4 py-10 text-center text-stone-400 text-sm">Cargando...</div>

  const images = product.images ?? []
  const subsection = (product as any).subsection
  const section = subsection?.section

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="relative bg-green-50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/3] relative overflow-hidden">
          {images.length > 0 ? (
            <Image src={images[imgIndex]} alt={product.name} fill className="object-cover transition-opacity duration-300" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-green-200 text-sm">Sin imagen</div>
          )}
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"><ChevronLeft size={20} /></button>
              <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"><ChevronRight size={20} /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full transition-all duration-200 ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`} />)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs text-green-400 mb-2">
          {section && <Link href={`/${section.slug}`} className="underline hover:text-green-600 transition-colors">{section.name}</Link>}
          {subsection && <> / <Link href={`/${section?.slug}/${subsection.slug}`} className="underline hover:text-green-600 transition-colors">{subsection.name}</Link></>}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">{product.name}</h1>
        {product.price !== null && <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-700 mt-2">{formatPrice(product.price)}</p>}
        {product.description && <p className="text-base sm:text-lg text-green-600 mt-4 leading-relaxed">{product.description}</p>}
        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-500 mb-3">Talla</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} className={`px-4 py-2 text-sm border rounded-xl transition-all duration-200 hover:scale-105 ${selectedSize === s ? 'bg-green-800 text-white border-green-800 shadow-md' : 'border-green-200 text-green-600 hover:border-green-300 bg-white'}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {product.colors.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-500 mb-3">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setSelectedColor(c === selectedColor ? null : c)} className={`px-4 py-2 text-sm border rounded-xl transition-all duration-200 hover:scale-105 ${selectedColor === c ? 'bg-green-800 text-white border-green-800 shadow-md' : 'border-green-200 text-green-600 hover:border-green-300 bg-white'}`}>{c}</button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 space-y-3">
          <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, me interesa: ${product.name}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white font-semibold rounded-2xl text-sm hover:bg-green-700 transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg">
            Consultar por WhatsApp
          </a>
          <Link href={`/${params.section}/${params.sub}`} className="flex items-center justify-center w-full py-3.5 border border-green-200 text-green-600 font-medium rounded-2xl text-sm hover:bg-green-50 transition-all duration-200 hover:scale-[1.02]">
            Volver
          </Link>
        </div>
      </div>
    </div>
  )
}
