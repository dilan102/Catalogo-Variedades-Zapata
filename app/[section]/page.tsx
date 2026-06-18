'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getSectionBySlug } from '@/lib/queries'
import type { Section } from '@/types'

export default function SectionPage({ params }: { params: { section: string } }) {
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSectionBySlug(params.section).then(setSection).finally(() => setLoading(false))
  }, [params.section])

  const subsections = (section?.subsections ?? []).filter((s: any) => s.is_active).sort((a: any, b: any) => a.order - b.order)

  return (
    <div className="px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      <p className="text-xs text-green-400 mb-2 animate-fade-in">
        <Link href="/" className="underline hover:text-green-600 transition-colors">Inicio</Link> / {section?.name ?? '...'}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6 animate-fade-in">{section?.name ?? '...'}</h1>
      {loading ? (
        <div className="space-y-3 animate-fade-in">{Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-green-50 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="divide-y divide-green-100 animate-fade-in">
          {subsections.map((sub: any, i) => (
            <Link 
              key={sub.id} 
              href={`/${params.section}/${sub.slug}`} 
              className="flex items-center justify-between py-5 hover:bg-green-50 transition-all duration-200 hover:pl-6 group animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-800 text-base sm:text-lg group-hover:text-green-700 transition-colors">{sub.name}</p>
                {sub.description && <p className="text-sm text-green-500 mt-1">{sub.description}</p>}
              </div>
              <ChevronRight size={18} className="text-green-300 flex-shrink-0 ml-3 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          ))}
          {subsections.length === 0 && <p className="text-center py-20 text-green-400 text-base animate-fade-in">No hay subcategorías aún.</p>}
        </div>
      )}
    </div>
  )
}
