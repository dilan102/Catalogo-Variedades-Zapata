'use client'
import { Leaf, Sparkles, Award } from 'lucide-react'

export default function Benefits() {
  const benefits = [
    {
      icon: Leaf,
      title: 'Tendencias Actuales',
      description: 'Catálogos actualizados con las últimas colecciones.',
    },
    {
      icon: Sparkles,
      title: 'Calidad Garantizada',
      description: 'Prendas seleccionadas para revendedores.',
    },
    {
      icon: Award,
      title: 'Precios Competitivos',
      description: 'Márgenes que impulsan tu negocio.',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-[#EAF8EC]">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="text-center p-8"
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
