'use client'
import { useState } from 'react'
import { runInitialization } from '@/lib/init-categories'

export default function InitCategoriesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitialize = async () => {
    setLoading(true)
    setResult(null)
    
    const response = await runInitialization()
    setResult(response)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-[#0F2A1A] mb-6">Inicializar Categorías</h1>
      
      <div className="glass-card p-6 mb-6">
        <h2 className="font-semibold text-lg text-[#0F2A1A] mb-4">Categorías a crear:</h2>
        <ul className="space-y-2 text-sm text-[#5C7A66]">
          <li><strong>Dama:</strong> Pantalones, Camisas, Chaquetas, Sacos, Blusas, Vestidos, Ropa deportiva, Corsets, Ropa interior, Medias, Zapatos</li>
          <li><strong>Caballero:</strong> Pantalones, Pantalonetas, Camisas, Sacos, Chaquetas, Medias, Zapatos, Ropa interior, Ropa deportiva</li>
          <li><strong>Niño:</strong> Pantalones, Zapatos, Camisas, Sacos, Chaquetas, Medias, Ropa interior, Ropa deportiva</li>
          <li><strong>Niña:</strong> Pantalones, Camisas, Chaquetas, Sacos, Blusas, Zapatos, Vestidos, Ropa deportiva, Corsets, Ropa interior, Medias</li>
          <li><strong>Accesorios:</strong> Gafas, Relojería, Joyería, Tecnología</li>
          <li><strong>Edredones:</strong> Sábanas, Almohadas, Cobijas, Cubrelechos, Fundas</li>
          <li><strong>Esika:</strong> (sin subsecciones)</li>
          <li><strong>Avon:</strong> (sin subsecciones)</li>
        </ul>
      </div>

      <button
        onClick={handleInitialize}
        disabled={loading}
        className="btn-primary px-6 py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Inicializando...' : 'Inicializar Categorías'}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}
