'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5DC] via-white to-[#98FB98]/30 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#6B8E23]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#98FB98]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#556B2F] leading-tight mb-6">
            Vendemos prendas asombrosas
          </h1>
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#6B8E23] mb-12 max-w-3xl mx-auto leading-relaxed">
            Moda que inspira, calidad que enamora y precios que impulsan tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              href="#categorias" 
              className="px-8 py-4 bg-[#6B8E23] text-white font-serif font-semibold rounded-full hover:bg-[#556B2F] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-center"
            >
              Ver Catálogo
            </Link>
            <a 
              href="https://wa.me/573000000000" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-[#6B8E23] border-2 border-[#6B8E23] font-serif font-semibold rounded-full hover:bg-[#F5F5DC] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-center"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
