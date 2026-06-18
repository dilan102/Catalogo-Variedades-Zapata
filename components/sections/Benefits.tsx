'use client'
import { Leaf, Sparkles, Award } from 'lucide-react'

export default function Benefits() {
  const benefits = [
    {
      icon: Leaf,
      title: 'Tendencias Actuales',
      description: 'Siempre al día con las últimas tendencias de moda para tu negocio.',
    },
    {
      icon: Sparkles,
      title: 'Calidad que Destaca',
      description: 'Prendas de alta calidad que enamoran a tus clientes.',
    },
    {
      icon: Award,
      title: 'Estilo que Representa',
      description: 'Diseños únicos que reflejan elegancia y sofisticación.',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-[#EAF8EC] relative overflow-hidden">
      {/* Botanical pattern background */}
      <svg className="absolute inset-0 opacity-5" viewBox="0 0 100 100" fill="none" stroke="#3E9A60" strokeWidth="0.5">
        <path d="M0 50 Q25 30 50 50 T100 50" />
        <path d="M0 60 Q25 40 50 60 T100 60" />
        <path d="M0 70 Q25 50 50 70 T100 70" />
      </svg>
      
      <div className="px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="glass-card text-center p-8 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[rgba(62,154,96,0.1)] rounded-2xl flex items-center justify-center">
                  <Icon size={32} className="text-[#3E9A60]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F2A1A] mb-4">{benefit.title}</h3>
                <p className="text-base text-[#5C7A66] leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
