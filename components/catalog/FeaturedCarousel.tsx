'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const items = useMemo(() => products, [products])

  const scrollNext = () => {
    const carousel = carouselRef.current
    if (!carousel) return

    const step = carousel.clientWidth * 0.9
    const nextPosition = carousel.scrollLeft + step

    if (nextPosition >= carousel.scrollWidth - carousel.clientWidth - 1) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      carousel.scrollBy({ left: step, behavior: 'smooth' })
    }
  }

  const scrollPrev = () => {
    const carousel = carouselRef.current
    if (!carousel) return

    const step = carousel.clientWidth * 0.9
    const prevPosition = carousel.scrollLeft - step

    if (prevPosition <= 0) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' })
    } else {
      carousel.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!carouselRef.current) return

    const interval = window.setInterval(() => {
      scrollNext()
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  const handleToggle = (id: number) => {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <div className="relative rounded-3xl border border-[#DCEFDD] bg-white p-6 sm:p-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#3E9A60] mb-2">NOVEDADES</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A]">Lo nuevo</h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center px-2 sm:flex">
          <button
            type="button"
            onClick={scrollPrev}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#0F2A1A] shadow-sm transition hover:bg-white"
            aria-label="Anterior"
          >
            ‹
          </button>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory sm:pb-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {loading
            ? Array(4).fill(0).map((_, index) => (
                <div key={index} className="min-w-[220px] flex-1">
                  <ProductCardSkeleton />
                </div>
              ))
            : items.map((product) => {
                const image = product.images?.[0]
                const hasImage = Boolean(image)
                const isActive = activeId === product.id

                return (
                  <article
                    key={product.id}
                    className="min-w-[220px] max-w-[320px] flex-1 snap-start rounded-3xl border border-[#DCEFDD] bg-[#FAFCF9] shadow-sm transition duration-300 hover:shadow-lg"
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
                          sizes="(max-width: 640px) 100vw, 33vw"
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
                  </article>
                )
              })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center px-2 sm:flex">
          <button
            type="button"
            onClick={scrollNext}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#0F2A1A] shadow-sm transition hover:bg-white"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
