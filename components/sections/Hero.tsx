'use client'
import { useState } from 'react'

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
    </section>
  )
}
