'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSubsectionBySlug, getProductsBySubsection } from '@/lib/queries'
import ProductCard from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import type { Subsection, Product } from '@/types'

export default function SubsectionPage({ params }: { params: { section: string; sub: string } }) {
  const [subsection, setSubsection] = useState<Subsection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubsectionBySlug(params.section, params.sub).then(async (sub) => {
      setSubsection(sub)
      if (sub) {
        const prods = await getProductsBySubsection(sub.id)
        setProducts(prods)
      }
    }).finally(() => setLoading(false))
  }, [params.section, params.sub])

  const section = (subsection as any)?.section

  return (
    <div className="px-4 py-5">
      <p className="text-xs text-stone-400 mb-1">
        <Link href="/" className="underline underline-offset-1">Inicio</Link>
        {' / '}
        <Link href={`/${params.section}`} className="underline underline-offset-1">
          {section?.name ?? params.section}
        </Link>
        {' / '}
        {subsection?.name ?? params.sub}
      </p>

      <div className="flex items-end justify-between mb-5">
        <h1 className="text-xl font-bold text-stone-900">{subsection?.name ?? '...'}</h1>
        {!loading && <span className="text-xs text-stone-400">{products.length} productos</span>}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length > 0
            ? products.map((p) => (
                <ProductCard key={p.id} product={p} href={`/${params.section}/${params.sub}/${p.id}`} />
              ))
            : null
        }
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <p className="text-sm">No hay productos en esta subcategoría aún.</p>
        </div>
      )}
    </div>
  )
}
