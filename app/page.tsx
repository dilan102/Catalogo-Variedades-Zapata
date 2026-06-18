'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSections, getFeaturedProducts } from '@/lib/queries'
import SectionCard from '@/components/catalog/SectionCard'
import ProductCard from '@/components/catalog/ProductCard'
import { SectionCardSkeleton, ProductCardSkeleton } from '@/components/ui/Skeletons'
import type { Section, Product } from '@/types'

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSections(), getFeaturedProducts(6)])
      .then(([s, f]) => { 
        console.log('Secciones cargadas:', s.length)
        console.log('Productos destacados cargados:', f.length)
        setSections(s); 
        setFeatured(f) 
      })
      .catch((error) => {
        console.error('Error al cargar datos:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-4 py-6 sm:py-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-green-900 italic">Nueva colección</h1>
        <p className="text-green-600 text-base mt-2 italic">Encuentra tu estilo</p>
      </div>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 italic">Categorías</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-5">
          {loading ? Array(6).fill(0).map((_, i) => <SectionCardSkeleton key={i} />) : sections.map((s, i) => (
            <div key={s.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-slide-up">
              <SectionCard section={s} />
            </div>
          ))}
        </div>
      </section>
      {(loading || featured.length > 0) && (
        <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 italic">Destacados</h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-8">
            {loading ? Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : featured.map((p, i) => {
              const sub = (p as any).subsection
              const sec = sub?.section
              return (
                <div key={p.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-slide-up">
                  <ProductCard product={p} href={sec?.slug && sub?.slug ? `/${sec.slug}/${sub.slug}/${p.id}` : '#'} />
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
