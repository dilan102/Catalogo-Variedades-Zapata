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
    <section className="py-8">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <div className="w-10 h-10 bg-[rgba(62,154,96,0.1)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#3E9A60]" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-serif text-base font-semibold text-[#0F2A1A]">{benefit.title}</h3>
                  <p className="text-sm text-[#5C7A66]">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
