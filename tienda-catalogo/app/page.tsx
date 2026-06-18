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
      .then(([s, f]) => { setSections(s); setFeatured(f) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-4 py-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nueva colección</h1>
        <p className="text-stone-500 text-sm mt-1">Encuentra tu estilo en nuestra tienda</p>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-800">Categorías</h2>
          <Link href="/catalogo" className="text-xs text-stone-400 underline underline-offset-2">Ver todas</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array(4).fill(0).map((_, i) => <SectionCardSkeleton key={i} />)
            : sections.map((s) => <SectionCard key={s.id} section={s} />)
          }
        </div>
      </section>

      {(loading || featured.length > 0) && (
        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">Destacados</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {loading
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => {
                  const sub = (p as any).subsection
                  const sec = sub?.section
                  const href = sec?.slug && sub?.slug ? `/${sec.slug}/${sub.slug}/${p.id}` : `/producto/${p.id}`
                  return <ProductCard key={p.id} product={p} href={href} />
                })
            }
          </div>
        </section>
      )}
    </div>
  )
}
