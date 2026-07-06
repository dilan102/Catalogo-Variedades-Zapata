 'use client'
import { useEffect, useMemo, useState } from 'react'
import { getProductById } from '@/lib/queries'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams() as { section?: string; sub?: string; productId?: string } | null
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const productId = params?.productId
    if (!productId) return

    const loadProduct = async () => {
      setLoading(true)
      setProduct(null)
      setSelectedImageIndex(0)

      try {
        const result = await getProductById(productId)
        if (result) setProduct(result)
      } catch {
        // keep empty
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [params?.productId])

  const images = useMemo(() => product?.images ?? [], [product])
  const selectedImage = images[selectedImageIndex] ?? null
  const showImageNavigation = images.length > 1
  const whatsappNumber = '573054110472'
  const whatsappProductColor = product?.colors?.[0] ?? ''
  const whatsappSizes = product?.sizes?.slice(0, 4).join(', ') ?? ''
  const whatsappMessage = `Hola, quisiera mas información acerca de este producto: ${product?.name ?? ''}${whatsappProductColor ? `\nColor: ${whatsappProductColor}` : ''}${whatsappSizes ? `\nTallas disponibles: ${whatsappSizes}` : ''}${product?.description ? `\nModelo / detalles: ${product.description}` : ''}`
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  useEffect(() => {
    if (!images.length) return

    const preloadImages = () => {
      images.forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
    }

    preloadImages()
  }, [images])

  const changeImage = (index: number) => {
    if (index === selectedImageIndex || images.length === 0) return
    setIsTransitioning(true)
    setSelectedImageIndex(index)
    window.setTimeout(() => setIsTransitioning(false), 120)
  }

  const goToPrevious = () => {
    if (images.length <= 1) return
    changeImage((selectedImageIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    if (images.length <= 1) return
    changeImage((selectedImageIndex + 1) % images.length)
  }

  const shareProduct = () => {
    if (!product) return

    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''
    const message = `Hola, quisiera más información acerca de este producto.\n${product.name}\n${productUrl}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/573054110472?text=${encodedMessage}`

    window.location.href = whatsappUrl
  }

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
              <>
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  className={`h-full w-full object-cover transition-opacity duration-150 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}
                  loading="eager"
                  decoding="async"
                />
                {showImageNavigation && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F2A1A] shadow-sm transition hover:bg-white"
                      aria-label="Imagen anterior"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F2A1A] shadow-sm transition hover:bg-white"
                      aria-label="Siguiente imagen"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0F2A1A]/80 px-3 py-1 text-xs font-semibold text-white">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <ImagePlaceholder className="absolute inset-0" />
            )}
          </div>

          {images.length > 1 && (
            <div className="px-4 pb-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => changeImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition ${index === selectedImageIndex ? 'border-[#3E9A60] ring-2 ring-[#3E9A60]/20' : 'border-[#E4E8E3]'}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} vista ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <div className="mt-5">
              <button
                type="button"
                onClick={shareProduct}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-[#3E9A60] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#34784c] focus:outline-none focus:ring-2 focus:ring-[#3E9A60]/40"
              >
                ¿Quieres Este Producto?
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
