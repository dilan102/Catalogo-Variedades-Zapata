'use client'
import { useState } from 'react'
import Link from 'next/link'

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
    <section className="relative min-h-screen flex items-center justify-center bg-[#FAFCF9] overflow-hidden">
      {/* Radial gradient natural */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(111,203,140,0.15),transparent_55%)]" />
      
      {/* Botanical leaf SVG decoration */}
      <svg className="absolute top-20 right-10 w-48 h-48 opacity-25" viewBox="0 0 100 100" fill="none" stroke="#6FCB8C" strokeWidth="1">
        <path d="M50 95 C30 85 20 65 25 45 C30 25 45 15 50 5 C55 15 70 25 75 45 C80 65 70 85 50 95" />
        <path d="M50 5 C50 25 50 45 50 95" />
        <path d="M50 30 C35 35 25 45 25 45" />
        <path d="M50 50 C35 55 25 65 25 65" />
        <path d="M50 70 C35 75 25 85 25 85" />
        <path d="M50 30 C65 35 75 45 75 45" />
        <path d="M50 50 C65 55 75 65 75 65" />
        <path d="M50 70 C65 75 75 85 75 85" />
      </svg>
      
      <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#0F2A1A] leading-tight mb-6">
            Vendemos prendas <span className="text-[#1F6B3C]">asombrosas</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#5C7A66] mb-12 max-w-3xl mx-auto leading-relaxed">
            Moda que inspira, calidad que enamora y precios que impulsan tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a 
              href="#categorias" 
              onClick={handleScroll}
              className={`btn-primary px-8 py-4 text-white font-semibold text-center transition-all duration-300 ${scrolling ? 'scale-95 opacity-80' : ''}`}
            >
              {scrolling ? 'Deslizando...' : 'Ver Catálogo'}
            </a>
            <a 
              href="https://wa.me/573000000000" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#1F6B3C] border border-[#6FCB8C] font-semibold rounded-14 hover:bg-white transition-all duration-300 shadow-sm text-center"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#3E9A60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
