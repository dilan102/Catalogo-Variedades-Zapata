'use client'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getSectionBySlug } from '@/lib/queries'
import type { Section } from '@/types'

export default function SectionPage({ params }: { params: { section: string } }) {
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSectionBySlug(params.section)
      .then((s) => setSection(s))
      .finally(() => setLoading(false))
  }, [params.section])

  if (!loading && !section) return notFound()

  const subsections = (section?.subsections ?? [])
    .filter((s: any) => s.is_active)
    .sort((a: any, b: any) => a.order - b.order)

  return (
    <div>
      <div className="relative h-44 bg-stone-200 overflow-hidden">
        {section?.image_url && (
          <Image src={section.image_url} alt={section.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white/70 text-xs mb-1">
            <Link href="/" className="underline underline-offset-1">Inicio</Link> / {section?.name}
          </p>
          <h1 className="text-white text-2xl font-bold">{section?.name ?? '...'}</h1>
        </div>
      </div>

      <div className="px-4 py-5">
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
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
                    {sub.description && <p className="text-xs text-stone-400 mt-0.5">{sub.description}</p>}
                  </div>
                </div>
                <ChevronRight size={16} className="text-stone-300" />
              </Link>
            ))}
            {subsections.length === 0 && (
              <p className="text-center py-16 text-stone-400 text-sm">No hay subcategorías aún.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
