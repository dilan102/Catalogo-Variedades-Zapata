'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'

type FeaturedCarouselProps = {
  products: Product[]
  loading: boolean
}

export default function FeaturedCarousel({ products, loading }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)

  const items = useMemo(() => products, [products])

  const goToIndex = (index: number) => {
    if (items.length === 0) return
    const normalized = ((index % items.length) + items.length) % items.length
    setCurrentIndex(normalized)
  }

  const nextSlide = () => {
    setCurrentIndex((current) => (items.length > 0 ? (current + 1) % items.length : current))
  }

  const prevSlide = () => {
    setCurrentIndex((current) => (items.length > 0 ? (current - 1 + items.length) % items.length : current))
  }

  useEffect(() => {
    if (items.length === 0) return

    const interval = window.setInterval(nextSlide, 4000)
    return () => window.clearInterval(interval)
  }, [items.length])

  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0)
    }
  }, [items.length, currentIndex])

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <div className="relative rounded-3xl bg-white p-6 sm:p-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#3E9A60] mb-2">NOVEDADES</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A]">Lo nuevo</h2>
      </div>

      <div className="relative overflow-hidden rounded-[32px]">
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0F2A1A] shadow-sm transition hover:bg-white sm:left-4"
          aria-label="Anterior"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0F2A1A] shadow-sm transition hover:bg-white sm:right-4"
          aria-label="Siguiente"
        >
          ›
        </button>

        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {loading
            ? Array(4).fill(0).map((_, index) => (
                <div key={index} className="min-w-full shrink-0 px-2 sm:px-4">
                  <ProductCardSkeleton />
                </div>
              ))
            : items.map((product) => {
                const image = product.images?.[0]
                const hasImage = Boolean(image)
                const isActive = activeId === product.id

                return (
                  <article key={product.id} className="min-w-full shrink-0 px-2 sm:px-4">
                    <div
                      className="group overflow-hidden rounded-[28px] bg-[#FAFCF9] shadow-sm"
                      onClick={() => handleToggle(product.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleToggle(product.id)
                        }
                      }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAFCF9]">
                        {hasImage ? (
                          <Image
                            src={image!}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 100vw"
                          />
                        ) : (
                          <ImagePlaceholder className="absolute inset-0" />
                        )}
                      </div>

                      <div className={`transition-all duration-300 ${isActive ? 'max-h-[240px] py-5 px-4' : 'max-h-0 px-4'} overflow-hidden bg-white`}>
                        <div className="space-y-3">
                          <p className="text-base font-semibold text-[#0F2A1A] line-clamp-2">{product.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.slice(0, 4).map((size) => (
                              <span
                                key={size}
                                className="rounded-full border border-[#DCEFDD] bg-[#F8FBF7] px-2 py-1 text-[10px] text-[#0F2A1A]"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/${(product as any).subsection?.section?.slug || ''}/${(product as any).subsection?.slug || ''}/${product.id}`}
                            className="inline-flex items-center justify-center rounded-full bg-[#3E9A60] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F7A53]"
                            onClick={(event) => event.stopPropagation()}
                          >
                            Ver producto
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
        </div>
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${currentIndex === index ? 'bg-[#3E9A60]' : 'bg-[#D9E7D9]'}`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
