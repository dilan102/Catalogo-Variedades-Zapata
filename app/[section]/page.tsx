'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSectionBySlug } from '@/lib/queries'
import type { Section, Subsection } from '@/types'
import SubsectionCard from '@/components/catalog/SubsectionCard'

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)
  const [sectionSlug, setSectionSlug] = useState<string>('')

  useEffect(() => {
    params.then(async (resolvedParams) => {
      setSectionSlug(resolvedParams.section)
      
      // Obtener el nombre de la sección para asegurar que existan todas las subsecciones
      const sectionData = await getSectionBySlug(resolvedParams.section)
      if (sectionData?.name) {
        try {
          console.log('Asegurando subsecciones para:', sectionData.name)
          const ensureResponse = await fetch('/api/admin/ensure-subsections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionName: sectionData.name }),
          })
          const ensureResult = await ensureResponse.json()
          console.log('Respuesta ensure-subsections:', ensureResult)
          
          if (ensureResult.success && ensureResult.created?.length > 0) {
            console.log('Subsecciones creadas:', ensureResult.created)
            // Pequeña pausa para asegurar que la BD está sincronizada
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (error) {
          console.error('Error ensuring subsections:', error)
        }
        
        // Recargar la sección para obtener las subsecciones actualizadas
        const updatedSection = await getSectionBySlug(resolvedParams.section)
        setSection(updatedSection)
      } else {
        setSection(sectionData)
      }
      setLoading(false)
    })
  }, [params])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [sectionSlug])

  const subsections = [...(section?.subsections ?? [])].sort((a: Subsection, b: Subsection) => a.order - b.order)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <p className="mb-2 text-xs text-[#5C7A66] animate-fade-in">
        <Link href="/" className="underline transition-colors hover:text-[#3E9A60]">Inicio</Link> / {section?.name ?? '...'}
      </p>
      <h1 className="mb-6 text-2xl font-bold text-[#0F2A1A] sm:text-3xl animate-fade-in">{section?.name ?? '...'}</h1>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 animate-fade-in">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="aspect-square rounded-2xl bg-[#EAF8EC] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {subsections.map((sub: Subsection, index) => (
              <div key={sub.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <SubsectionCard subsection={sub} sectionSlug={sectionSlug} />
              </div>
            ))}
          </div>
          {subsections.length === 0 && <p className="py-20 text-center text-base text-[#5C7A66]">No hay subcategorías aún.</p>}
        </div>
      )}
    </div>
  )
}
