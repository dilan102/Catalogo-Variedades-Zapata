import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getSectionBySlug } from '@/lib/queries'

export const revalidate = 60

interface Props {
  params: { section: string }
}

export default async function SectionPage({ params }: Props) {
  const section = await getSectionBySlug(params.section)
  if (!section) notFound()

  const subsections = (section.subsections ?? [])
    .filter((s: any) => s.is_active)
    .sort((a: any, b: any) => a.order - b.order)

  return (
    <div>
      {/* Header de sección */}
      <div className="relative h-44 bg-stone-200 overflow-hidden">
        {section.image_url && (
          <Image src={section.image_url} alt={section.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white/70 text-xs mb-1">
            <Link href="/" className="underline underline-offset-1">Inicio</Link>
            {' / '}
            {section.name}
          </p>
          <h1 className="text-white text-2xl font-bold">{section.name}</h1>
        </div>
      </div>

      {/* Subsecciones */}
      <div className="px-4 py-5">
        <p className="text-xs text-stone-400 mb-4 uppercase tracking-wider font-medium">
          {subsections.length} subcategorías
        </p>
        <div className="divide-y divide-stone-100">
          {subsections.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/${params.section}/${sub.slug}`}
              className="flex items-center justify-between py-4 group"
            >
              <div className="flex items-center gap-3">
                {sub.image_url && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <Image src={sub.image_url} alt={sub.name} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-stone-800 text-sm">{sub.name}</p>
                  {sub.description && (
                    <p className="text-xs text-stone-400 mt-0.5">{sub.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
            </Link>
          ))}
        </div>

        {subsections.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <p className="text-sm">No hay subcategorías en esta sección aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}
