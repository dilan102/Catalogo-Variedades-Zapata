'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getSectionBySlug } from '@/lib/queries'
import type { Section } from '@/types'

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)
  const [sectionSlug, setSectionSlug] = useState<string>('')

  useEffect(() => {
    params.then((resolvedParams) => {
      setSectionSlug(resolvedParams.section)
      getSectionBySlug(resolvedParams.section).then(setSection).finally(() => setLoading(false))
    })
  }, [params])

  const subsections = (section?.subsections ?? []).sort((a: any, b: any) => a.order - b.order)

  return (
    <div className="px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      <p className="text-xs text-[#5C7A66] mb-2 animate-fade-in">
        <Link href="/" className="underline hover:text-[#3E9A60] transition-colors">Inicio</Link> / {section?.name ?? '...'}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A1A] mb-6 animate-fade-in">{section?.name ?? '...'}</h1>
      {loading ? (
        <div className="space-y-3 animate-fade-in">{Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-[#EAF8EC] rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="divide-y divide-[#DCEFDD] animate-fade-in">
          {subsections.map((sub: any, i) => (
            <Link 
              key={sub.id} 
              href={`/${sectionSlug}/${sub.slug}`} 
              className="flex items-center justify-between py-5 hover:bg-[#EAF8EC] transition-all duration-200 hover:pl-6 group animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0F2A1A] text-base sm:text-lg group-hover:text-[#3E9A60] transition-colors">{sub.name}</p>
                {sub.description && <p className="text-sm text-[#5C7A66] mt-1">{sub.description}</p>}
              </div>
              <ChevronRight size={18} className="text-[#6FCB8C] flex-shrink-0 ml-3 group-hover:text-[#3E9A60] group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          ))}
          {subsections.length === 0 && <p className="text-center py-20 text-[#5C7A66] text-base animate-fade-in">No hay subcategorías aún.</p>}
        </div>
      )}
    </div>
  )
}
