'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, GripVertical, ChevronLeft } from 'lucide-react'
import { getAllSubsectionsAdmin, getAllSectionsAdmin, upsertSubsection, deleteSubsection } from '@/lib/queries'
import type { Subsection, Section } from '@/types'
import AdminGuard from '@/components/ui/AdminGuard'

export default function SubsectionsAdmin() {
  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Subsection | null>(null)
  const [formData, setFormData] = useState({ section_id: '', name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subs, secs] = await Promise.all([getAllSubsectionsAdmin(), getAllSectionsAdmin()])
      setSubsections(subs.sort((a, b) => a.order - b.order))
      setSections(secs)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertSubsection({ ...formData, id: editing?.id })
      setShowModal(false)
      setEditing(null)
      setFormData({ section_id: '', name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })
      loadData()
    } catch (error) {
      console.error('Error saving subsection:', error)
      alert('Error al guardar la subsección')
    }
  }

  const handleEdit = (sub: Subsection) => {
    setEditing(sub)
    setFormData({ section_id: sub.section_id, name: sub.name, slug: sub.slug, description: sub.description || '', image_url: sub.image_url || '', order: sub.order, is_active: sub.is_active })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta subsección?')) return
    try {
      await deleteSubsection(id)
      loadData()
    } catch (error) {
      console.error('Error deleting subsection:', error)
      alert('Error al eliminar la subsección')
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) })
  }

  const getSectionName = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    return section?.name || sectionId
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-green-50">
      <div className="bg-white border-b border-green-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 text-green-600">
            <ChevronLeft size={20} />
            <span className="font-medium">Volver</span>
          </Link>
          <h1 className="text-lg font-bold text-green-900">Subsecciones</h1>
          <button onClick={() => { setEditing(null); setFormData({ section_id: '', name: '', slug: '', description: '', image_url: '', order: subsections.length, is_active: true }); setShowModal(true) }} className="flex items-center gap-1.5 bg-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium">
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-green-200 animate-pulse">
                <div className="h-4 bg-green-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-green-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : subsections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-green-400 text-sm mb-4">No hay subsecciones aún</p>
            {sections.length === 0 ? (
              <p className="text-green-500 text-sm">Primero crea una sección</p>
            ) : (
              <button onClick={() => { setEditing(null); setFormData({ section_id: sections[0].id, name: '', slug: '', description: '', image_url: '', order: 0, is_active: true }); setShowModal(true) }} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Crear primera subsección
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {subsections.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="text-green-300 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-green-900">{sub.name}</h3>
                      <p className="text-xs text-green-400 mt-0.5">{sub.slug}</p>
                      <p className="text-xs text-green-500 mt-1">Sección: {getSectionName(sub.section_id)}</p>
                      {sub.description && <p className="text-sm text-green-600 mt-1 line-clamp-2">{sub.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-500'}`}>
                          {sub.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                        <span className="text-xs text-green-400">Orden: {sub.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(sub)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-green-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-green-900">{editing ? 'Editar subsección' : 'Nueva subsección'}</h2>
              <button onClick={() => setShowModal(false)} className="text-green-400 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Sección *</label>
                <select value={formData.section_id} onChange={(e) => setFormData({ ...formData, section_id: e.target.value })} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecciona una sección</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Vestidos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50" placeholder="vestidos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Descripción de la subsección" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">URL de imagen</label>
                <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Orden</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-green-800 rounded focus:ring-green-500" />
                <label htmlFor="is_active" className="text-sm text-green-700">Subsección activa</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-green-300 text-green-700 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-green-800 text-white rounded-lg font-medium">{editing ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminGuard>
  )
}
