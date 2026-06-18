'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getSubsectionBySlug, getProductsBySubsection } from '@/lib/queries'
import ProductCard from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import type { Subsection, Product } from '@/types'

export default function SubsectionPage({ params }: { params: Promise<{ section: string; sub: string }> }) {
  const { section: sectionSlug, sub: subSlug } = use(params)
  const [subsection, setSubsection] = useState<Subsection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubsectionBySlug(sectionSlug, subSlug).then(async (sub) => {
      setSubsection(sub)
      if (sub) setProducts(await getProductsBySubsection(sub.id))
    }).finally(() => setLoading(false))
  }, [sectionSlug, subSlug])

  const section = (subsection as any)?.section

  return (
    <div className="px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      <p className="text-xs text-green-400 mb-2 animate-fade-in">
        <Link href="/" className="underline hover:text-green-600 transition-colors">Inicio</Link>
        {' / '}
        <Link href={`/${sectionSlug}`} className="underline hover:text-green-600 transition-colors">{section?.name ?? sectionSlug}</Link>
        {' / '}
        {subsection?.name}
      </p>
      <div className="flex items-end justify-between mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900">{subsection?.name ?? '...'}</h1>
        {!loading && <span className="text-sm text-green-500">{products.length} productos</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-8">
        {loading
          ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-slide-up">
                <ProductCard product={p} href={`/${sectionSlug}/${subSlug}/${p.id}`} />
              </div>
            ))
        }
      </div>
      {!loading && products.length === 0 && (
        <p className="text-center py-24 text-green-400 text-base animate-fade-in">No hay productos aún.</p>
      )}
    </div>
  )
}
