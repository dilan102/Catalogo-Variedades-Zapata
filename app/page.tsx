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
        const orderedSections = s.slice().sort((a, b) => {
          const order = ['dama', 'caballero', 'joven', 'nino', 'nina', 'accesorios', 'edredones', 'esika']
          return order.indexOf(a.slug) - order.indexOf(b.slug)
        })
        setSections(orderedSections)
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
        <section id="categorias" className="mb-16 border border-[#DCEFDD] rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3E9A60] mb-2">CATÁLOGO</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A]">Nuestras Prendas</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? Array(4).fill(0).map((_, i) => <SectionCardSkeleton key={i} />) : sections.map((s) => (
              <SectionCard key={s.id} section={s} />
            ))}
          </div>
        </section>
        
        <div className="flex justify-center my-12">
          <div className="w-20 h-0.5 bg-[#6FCB8C]"></div>
        </div>
        
        {(loading || featured.length > 0) && (
          <section className="border border-[#DCEFDD] rounded-3xl p-6 sm:p-10 animate-fade-in">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3E9A60] mb-2">NOVEDADES</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F2A1A]">Lo nuevo</h2>
            </div>
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
