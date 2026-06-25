'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Slide {
  type: 'photo' | 'logo'
  src?: string
  word?: string
}

const slides: Slide[] = [
  { type: 'photo', src: '/Dama_elegante.png', word: 'ELEGANCIA' },
  { type: 'photo', src: '/Dama_rojo.jpeg', word: 'ESTILO' },
  { type: 'photo', src: '/Dama_sentada.png', word: 'DISTINCIÓN' },
  { type: 'logo', src: '/variedades_zapata.png', word: 'VARIEDADES ZAPATA' },
]

export default function Preloader() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [showWord, setShowWord] = useState(false)
  const [sweepPosition, setSweepPosition] = useState<'idle' | 'entering' | 'exiting'>('idle')
  const [hideContent, setHideContent] = useState(false)

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const slideDuration = 750
  const logoDuration = 900
  const sweepDuration = 400
  const wordDelay = 200

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const runSequence = async () => {
      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i)
        setShowWord(false)
        setHideContent(false)

        // Mostrar palabra después de la foto
        if (slides[i].type === 'photo') {
          setTimeout(() => setShowWord(true), wordDelay)
        }

        // Esperar duración del slide
        const currentDuration = slides[i].type === 'logo' ? logoDuration : slideDuration
        await new Promise(resolve => setTimeout(resolve, currentDuration))

        // Barrido hacia el siguiente slide (excepto el último)
        if (i < slides.length - 1) {
          if (!prefersReducedMotion) {
            setHideContent(true)
            setSweepPosition('entering')
            await new Promise(resolve => setTimeout(resolve, sweepDuration / 2))
            setCurrentSlide(i + 1)
            setShowWord(false)
            setSweepPosition('exiting')
            await new Promise(resolve => setTimeout(resolve, sweepDuration / 2))
            setSweepPosition('idle')
            setHideContent(false)
          } else {
            // Fade simple para reduced motion
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        }
      }

      // Fade-out final
      setFadeOut(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setVisible(false)
    }

    runSequence()
  }, [mounted, prefersReducedMotion])

  if (!mounted || !visible) return null

  const currentSlideData = slides[currentSlide]

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFCF9] transition-all duration-400 ${
        fadeOut ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
      }`}
      aria-hidden="true"
    >
      {/* Barrido de transición (pantalla completa) */}
      {!prefersReducedMotion && sweepPosition !== 'idle' && (
        <div 
          className="fixed inset-0 z-[110] bg-gradient-to-r from-[#3E9A60] to-[#1F6B3C] transition-transform ease-in-out"
          style={{ 
            transform: sweepPosition === 'entering' ? 'translateX(-100%)' : 'translateX(100%)',
            transitionDuration: `${sweepDuration}ms`
          }}
        />
      )}

      {/* Contenedor principal centrado */}
      <div className={`relative flex flex-col items-center gap-6 transition-opacity duration-200 ${hideContent ? 'opacity-0' : 'opacity-100'}`}>
        {/* Palabra de fondo grande y transparente */}
        {currentSlideData.type === 'photo' && currentSlideData.word && (
          <p className="absolute inset-0 flex items-center justify-center font-display text-[15vw] sm:text-[20vw] text-[#3E9A60]/5 tracking-[0.2em] uppercase font-bold pointer-events-none">
            {currentSlideData.word}
          </p>
        )}

        {/* Slide de foto */}
        {currentSlideData.type === 'photo' && currentSlideData.src && (
          <div 
            className="relative w-[260px] sm:w-[320px] aspect-[3/4] overflow-hidden"
            style={{ 
              backgroundColor: '#FAFCF9',
              backgroundImage: `url(${currentSlideData.src})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}

        {/* Slide de logo */}
        {currentSlideData.type === 'logo' && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#BFEAC5] to-[#5FBE7B] rounded-full flex items-center justify-center overflow-hidden shadow-lg">
            <Image 
              src="/logo.jpg" 
              alt="Variedades Zapata" 
              width={112} 
              height={112} 
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Palabra debajo de la foto */}
        {currentSlideData.type === 'photo' && currentSlideData.word && (
          <p 
            className={`font-display text-lg sm:text-xl text-[#0F2A1A] tracking-[0.3em] uppercase transition-all duration-300 ${
              showWord ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {currentSlideData.word}
          </p>
        )}

        {/* Nombre de marca (solo en slide de logo) */}
        {currentSlideData.type === 'logo' && (
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F2A1A] tracking-tight">
            Variedades Zapata
          </h1>
        )}
      </div>
    </div>
  )
}
