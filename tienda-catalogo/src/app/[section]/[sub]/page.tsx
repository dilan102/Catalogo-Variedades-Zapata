import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubsectionBySlug, getProductsBySubsection } from '@/lib/queries'
import ProductCard from '@/components/catalog/ProductCard'

export const revalidate = 60

interface Props {
  params: { section: string; sub: string }
}

export default async function SubsectionPage({ params }: Props) {
  const subsection = await getSubsectionBySlug(params.section, params.sub)
  if (!subsection) notFound()

  const products = await getProductsBySubsection(subsection.id)
  const section = subsection.section as any

  return (
    <div className="px-4 py-5">
      {/* Breadcrumb */}
      <p className="text-xs text-stone-400 mb-1">
        <Link href="/" className="underline underline-offset-1">Inicio</Link>
        {' / '}
        <Link href={`/${params.section}`} className="underline underline-offset-1">
          {section?.name ?? params.section}
        </Link>
        {' / '}
        {subsection.name}
      </p>

      <div className="flex items-end justify-between mb-5">
        <h1 className="text-xl font-bold text-stone-900">{subsection.name}</h1>
        <span className="text-xs text-stone-400">{products.length} productos</span>
      </div>

      {/* Grid de productos */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              href={`/${params.section}/${params.sub}/${p.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-400">
          <p className="text-sm">No hay productos en esta subcategoría aún.</p>
          <Link href={`/${params.section}`} className="text-xs underline mt-2 block">
            Volver a {section?.name}
          </Link>
        </div>
      )}
    </div>
  )
}
