import Link from 'next/link'
import { getSections, getFeaturedProducts } from '@/lib/queries'
import SectionCard from '@/components/catalog/SectionCard'
import ProductCard from '@/components/catalog/ProductCard'

export const revalidate = 60

export default async function HomePage() {
  const [sections, featured] = await Promise.all([
    getSections(),
    getFeaturedProducts(6),
  ])

  return (
    <div className="px-4 py-5">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Nueva colección
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Encuentra tu estilo en nuestra tienda
        </p>
      </div>

      {/* Secciones */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-800">Categorías</h2>
          <Link href="/catalogo" className="text-xs text-stone-400 underline underline-offset-2">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => (
            <SectionCard key={s.id} section={s} />
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-stone-800 mb-3">Destacados</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {featured.map((p) => {
              const sub = p.subsection as any
              const sec = sub?.section as any
              const href = sec?.slug && sub?.slug
                ? `/${sec.slug}/${sub.slug}/${p.id}`
                : `/producto/${p.id}`
              return <ProductCard key={p.id} product={p} href={href} />
            })}
          </div>
        </section>
      )}
    </div>
  )
}
