'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Preloader() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const images = [
    '/Fotos/Dama_elegante.png',
    '/Fotos/Fondo_elegante.jpeg'
  ]

  useEffect(() => {
    setMounted(true)

    // Cross-fade entre imágenes (solo si no hay prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
      }, 600)
      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Iniciar fade-out después de 1.8-2.2 segundos
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1800)

    // Desmontar completamente después del fade-out
    const unmountTimer = setTimeout(() => {
      setVisible(false)
    }, 2200)

    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(unmountTimer)
    }
  }, [mounted])

  if (!mounted || !visible) return null

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFCF9] transition-all duration-300 ${
        fadeOut ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
      }`}
      aria-hidden="true"
    >
      {/* Imagen de fondo con cross-fade */}
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentImage && !prefersReducedMotion ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Logo y nombre centrados */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#BFEAC5] to-[#5FBE7B] rounded-full flex items-center justify-center overflow-hidden shadow-lg">
          <Image 
            src="/logo.jpg" 
            alt="Variedades Zapata" 
            width={80} 
            height={80} 
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0F2A1A] tracking-tight opacity-0 animate-fade-in">
          Variedades Zapata
        </h1>
      </div>
    </div>
  )
}
