'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSections, getFeaturedProducts } from '@/lib/queries'
import SectionCard from '@/components/catalog/SectionCard'
import ProductCard from '@/components/catalog/ProductCard'
import { SectionCardSkeleton, ProductCardSkeleton } from '@/components/ui/Skeletons'
import Hero from '@/components/sections/Hero'
import Benefits from '@/components/sections/Benefits'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import type { Section, Product } from '@/types'

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, f] = await Promise.all([getSections(), getFeaturedProducts(6)])
        console.log('Secciones cargadas:', s.length)
        console.log('Productos destacados cargados:', f.length)
        setSections(s)
        setFeatured(f)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="bg-[#FAFCF9] min-h-screen">
      <Hero />
      <Benefits />
      
      <div className="px-4 py-20 sm:py-24 max-w-7xl mx-auto">
        <section id="categorias" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A]">Nuestras Prendas</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? Array(4).fill(0).map((_, i) => <SectionCardSkeleton key={i} />) : sections.map((s) => (
              <SectionCard key={s.id} section={s} />
            ))}
          </div>
        </section>
        
        {(loading || featured.length > 0) && (
          <section className="animate-fade-in">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A] mb-8">Lo nuevo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-8">
              {loading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : featured.map((p) => {
                const sub = (p as any).subsection
                const sec = sub?.section
                return (
                  <ProductCard key={p.id} product={p} href={sec?.slug && sub?.slug ? `/${sec.slug}/${sub.slug}/${p.id}` : '#'} />
                )
              })}
            </div>
          </section>
        )}
      </div>
      
      <Contact />
      <Footer />
    </div>
  )
}
