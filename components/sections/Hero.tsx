'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [scrolling, setScrolling] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setScrolling(true)
    const target = document.querySelector('#categorias')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => setScrolling(false), 1000)
    }
  }

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center bg-[#FAFCF9] overflow-hidden">
      {/* Radial gradient natural */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(111,203,140,0.15),transparent_55%)]" />
      
      {/* Imagen de fondo elegante */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[70%] opacity-30">
        <Image 
          src="/fondo_elegante.png" 
          alt="Fondo elegante" 
          fill 
          className="object-contain object-center"
          priority
        />
      </div>
      
      <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#0F2A1A] leading-tight mb-6">
            No vendemos prendas <span className="text-[#1F6B3C]">Vendemos sueños</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#5C7A66] mb-12 max-w-3xl mx-auto leading-relaxed">
            Distribuidora mayorista de ropa para tu negocio.
          </p>
          <div className="flex justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="#categorias"
              onClick={handleScroll}
              className={`btn-primary px-8 py-4 text-white font-semibold text-center transition-all duration-300 ${scrolling ? 'scale-95 opacity-80' : ''}`}
            >
              {scrolling ? 'Deslizando...' : 'Ver Catálogo'}
            </a>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/573054110472"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#25D366]/20 bg-[#25D366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#1ea952]"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.149-.67.149-.198.297-.768.966-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.478-1.761-1.651-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.199-.297.298-.496.099-.198.049-.372-.025-.521-.074-.149-.669-1.612-.916-2.208-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.521.074-.792.372-.271.297-1.036 1.012-1.036 2.469 0 1.457 1.061 2.866 1.208 3.064.147.198 2.089 3.18 5.061 4.459.707.303 1.258.487 1.687.625.708.225 1.353.193 1.862.117.569-.085 1.758-.719 2.007-1.414.249-.695.249-1.29.174-1.414-.074-.124-.272-.199-.57-.348z"/>
          <path d="M12.001 0a12 12 0 0 0-10.3 18.1L0 24l6.1-1.6A12 12 0 1 0 12.001 0Zm6.58 17.31a7.16 7.16 0 0 1-7.15 7.15c-1.2 0-2.38-.31-3.42-.9l-.24-.14-3.61.95.96-3.52-.16-.24a7.16 7.16 0 0 1 10.8-8.84 7.16 7.16 0 0 1 2.64 5.07Z"/>
        </svg>
      </a>
    </section>
  )
}
