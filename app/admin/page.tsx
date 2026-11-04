'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAllSectionsAdmin, getSubsectionsBySection } from '@/lib/queries'
import { parseJsonResponse } from '@/lib/utils'
import type { Section, Subsection } from '@/types'

export default function AdminPage() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [sectionId, setSectionId] = useState('')
  const [subsectionId, setSubsectionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedSection = useMemo(() => sections.find((section) => section.id === sectionId), [sections, sectionId])
  const selectedSubsection = useMemo(() => subsections.find((subsection) => subsection.id === subsectionId), [subsections, subsectionId])

  useEffect(() => {
    void fetch('/api/me')
      .then((response) => parseJsonResponse<{ authenticated?: boolean }>(response))
      .then(async (data) => {
        if (!data.authenticated) {
          router.replace('/admin/login')
          return
        }
        setSections(await getAllSectionsAdmin())
      })
      .catch(() => setError('No se pudo cargar el panel de administración.'))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    setSubsectionId('')
    if (!sectionId) return setSubsections([])
    void getSubsectionsBySection(sectionId).then(setSubsections).catch(() => setSubsections([]))
  }, [sectionId])

  const productUrl = selectedSection && selectedSubsection ? `/${selectedSection.slug}/${selectedSubsection.slug}?new=1` : ''

  return (
    <div className="min-h-screen bg-[#FAFCF9] px-4 py-8 sm:py-12">
      <section className="mx-auto max-w-2xl rounded-3xl border border-[#DCEFDD] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <p className="text-sm font-semibold text-[#3E9A60]">Administración</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#0F2A1A]">Subir producto</h1>
          <p className="mt-2 text-sm text-[#5C7A66]">Escoge la categoría y subcategoría donde quedará el producto.</p>
        </div>
        {loading ? <p className="text-sm text-[#5C7A66]">Cargando categorías...</p> : error ? <p className="text-sm text-red-600">{error}</p> : (
          <div className="space-y-5">
            <label className="block"><span className="text-sm font-medium text-[#0F2A1A]">Categoría</span>
              <select value={sectionId} onChange={(event) => setSectionId(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"><option value="">Selecciona una categoría</option>{sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}</select>
            </label>
            <label className="block"><span className="text-sm font-medium text-[#0F2A1A]">Subcategoría</span>
              <select value={subsectionId} onChange={(event) => setSubsectionId(event.target.value)} disabled={!sectionId} className="mt-2 w-full rounded-2xl border border-[#E4E8E3] bg-[#FBFDF8] px-4 py-3 text-sm text-[#10221E] outline-none disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#3E9A60] focus:ring-2 focus:ring-[#D7F0DA]"><option value="">Selecciona una subcategoría</option>{subsections.map((subsection) => <option key={subsection.id} value={subsection.id}>{subsection.name}</option>)}</select>
            </label>
            {productUrl ? <Link href={productUrl} className="inline-flex w-full items-center justify-center rounded-2xl bg-[#3E9A60] px-4 py-3 font-semibold text-white transition hover:bg-[#2F7A53]">Continuar a subir producto</Link> : <button disabled className="w-full rounded-2xl bg-[#3E9A60]/50 px-4 py-3 font-semibold text-white">Selecciona categoría y subcategoría</button>}
          </div>
        )}
      </section>
    </div>
  )
}
