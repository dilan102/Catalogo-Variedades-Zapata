'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

type ImageCarouselModalProps = {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ImageCarouselModal({ product, isOpen, onClose }: ImageCarouselModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = product.images ?? []

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentImageIndex])

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentImageIndex]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[#DCEFDD]">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#0F2A1A]">{product.name}</h2>
              <p className="text-sm text-[#5C7A66] mt-1">
                Imagen {currentImageIndex + 1} de {images.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EAF8EC] text-[#3E9A60] transition hover:bg-[#D7F0DA]"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image */}
          <div className="relative flex-1 overflow-hidden bg-[#FAFCF9] flex items-center justify-center">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`${product.name} - imagen ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 80vw"
                priority
              />
            ) : (
              <ImagePlaceholder className="w-full h-full" />
            )}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 text-[#0F2A1A] transition hover:bg-white"
                aria-label="Imagen anterior"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 text-[#0F2A1A] transition hover:bg-white"
                aria-label="Siguiente imagen"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 p-4 sm:p-6 border-t border-[#DCEFDD] overflow-x-auto bg-[#FAFCF9]">
              {images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    index === currentImageIndex
                      ? 'border-[#3E9A60]'
                      : 'border-[#E4E8E3] hover:border-[#BCCFBC]'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
