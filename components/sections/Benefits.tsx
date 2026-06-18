'use client'

export default function Benefits() {
  const benefits = [
    {
      icon: '✨',
      title: 'Tendencias Actuales',
      description: 'Siempre al día con las últimas tendencias de moda para tu negocio.',
    },
    {
      icon: '🌟',
      title: 'Calidad que Destaca',
      description: 'Prendas de alta calidad que enamoran a tus clientes.',
    },
    {
      icon: '💎',
      title: 'Estilo que Representa',
      description: 'Diseños únicos que reflejan elegancia y sofisticación.',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-[#F5F5DC]/30">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#556B2F] mb-4">{benefit.title}</h3>
              <p className="font-sans text-base text-[#6B8E23] leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
