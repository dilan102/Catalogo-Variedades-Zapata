'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, GripVertical, ChevronLeft, ChevronDown, FolderOpen } from 'lucide-react'
import { getAllSectionsAdmin, upsertSection, deleteSection, getAllSubsectionsAdmin, upsertSubsection, deleteSubsection } from '@/lib/queries'
import type { Section, Subsection } from '@/types'
import AdminGuard from '@/components/ui/AdminGuard'

export default function SectionsAdmin() {
  const [sections, setSections] = useState<Section[]>([])
  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSubsectionModal, setShowSubsectionModal] = useState(false)
  const [editing, setEditing] = useState<Section | null>(null)
  const [editingSubsection, setEditingSubsection] = useState<Subsection | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })
  const [subsectionFormData, setSubsectionFormData] = useState({ section_id: '', name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [secs, subs] = await Promise.all([getAllSectionsAdmin(), getAllSubsectionsAdmin()])
      setSections(secs.sort((a, b) => a.order - b.order))
      setSubsections(subs.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertSection({ ...formData, id: editing?.id })
      setShowModal(false)
      setEditing(null)
      setFormData({ name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })
      loadData()
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Error al guardar la sección')
    }
  }

  const updateAllSectionImages = async () => {
    const sectionImages = {
      'dama': '/Dama.avif',
      'caballero': '/Caballero.jpg',
      'nino': '/Niño.webp',
      'nina': '/Niña.jpg',
      'accesorios': '/Accesorios.avif',
      'edredones': '/edredon.jpeg',
      'esika': '/Esika.png',
      'avon': '/Avon.png',
    }

    try {
      console.log('Updating section images for', sections.length, 'sections')
      for (const section of sections) {
        const imageUrl = sectionImages[section.slug as keyof typeof sectionImages]
        if (imageUrl) {
          console.log(`Updating ${section.slug} with ${imageUrl}`)
          await upsertSection({ ...section, image_url: imageUrl })
        } else {
          console.log(`No image found for slug: ${section.slug}`)
        }
      }
      loadData()
      alert('Imágenes actualizadas correctamente')
    } catch (error) {
      console.error('Error updating section images:', error)
      alert('Error al actualizar imágenes')
    }
  }

  const handleEdit = (section: Section) => {
    setEditing(section)
    setFormData({ name: section.name, slug: section.slug, description: section.description || '', image_url: section.image_url || '', order: section.order, is_active: section.is_active })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return
    try {
      await deleteSection(id)
      loadData()
    } catch (error) {
      console.error('Error deleting section:', error)
      alert('Error al eliminar la sección')
    }
  }

  const handleSubsectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertSubsection({ ...subsectionFormData, id: editingSubsection?.id })
      setShowSubsectionModal(false)
      setEditingSubsection(null)
      setSelectedSection(null)
      setSubsectionFormData({ section_id: '', name: '', slug: '', description: '', image_url: '', order: 0, is_active: true })
      loadData()
    } catch (error) {
      console.error('Error saving subsection:', error)
      alert('Error al guardar la subsección')
    }
  }

  const handleSubsectionEdit = (sub: Subsection) => {
    setEditingSubsection(sub)
    setSubsectionFormData({ section_id: sub.section_id, name: sub.name, slug: sub.slug, description: sub.description || '', image_url: sub.image_url || '', order: sub.order, is_active: sub.is_active })
    setShowSubsectionModal(true)
  }

  const handleSubsectionDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta subsección?')) return
    try {
      await deleteSubsection(id)
      loadData()
    } catch (error) {
      console.error('Error deleting subsection:', error)
      alert('Error al eliminar la subsección')
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const getSubsectionsForSection = (sectionId: string) => {
    return subsections.filter(s => s.section_id === sectionId).sort((a, b) => a.order - b.order)
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) })
  }

  const handleSubsectionNameChange = (name: string) => {
    setSubsectionFormData({ ...subsectionFormData, name, slug: generateSlug(name) })
  }

  const openSubsectionModal = (section: Section) => {
    setSelectedSection(section)
    setEditingSubsection(null)
    setSubsectionFormData({ section_id: section.id, name: '', slug: '', description: '', image_url: '', order: getSubsectionsForSection(section.id).length, is_active: true })
    setShowSubsectionModal(true)
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
          <h1 className="text-lg font-bold text-green-900">Secciones</h1>
          <div className="flex items-center gap-2">
            <button onClick={updateAllSectionImages} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
              <span className="hidden sm:inline">Actualizar Imágenes</span>
            </button>
            <button onClick={() => { setEditing(null); setFormData({ name: '', slug: '', description: '', image_url: '', order: sections.length, is_active: true }); setShowModal(true) }} className="flex items-center gap-1.5 bg-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium">
              <Plus size={18} />
              <span className="hidden sm:inline">Nueva</span>
            </button>
          </div>
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
        ) : sections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-green-400 text-sm mb-4">No hay secciones aún</p>
            <button onClick={() => { setEditing(null); setFormData({ name: '', slug: '', description: '', image_url: '', order: 0, is_active: true }); setShowModal(true) }} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Crear primera sección
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => {
              const sectionSubsections = getSubsectionsForSection(section.id)
              const isExpanded = expandedSections.has(section.id)
              return (
                <div key={section.id} className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="text-green-300 mt-1 flex-shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-green-900">{section.name}</h3>
                          {sectionSubsections.length > 0 && (
                            <button onClick={() => toggleSection(section.id)} className="text-green-400 hover:text-green-600 transition-colors">
                              <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-green-400 mt-0.5">{section.slug}</p>
                        {section.description && <p className="text-sm text-green-600 mt-1 line-clamp-2">{section.description}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${section.is_active ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-500'}`}>
                            {section.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                          <span className="text-xs text-green-400">Orden: {section.order}</span>
                          <span className="text-xs text-green-400">{sectionSubsections.length} subsecciones</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openSubsectionModal(section)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Agregar subsección">
                        <FolderOpen size={18} />
                      </button>
                      <button onClick={() => handleEdit(section)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(section.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {isExpanded && sectionSubsections.length > 0 && (
                    <div className="border-t border-green-100 bg-green-50/50 p-3 space-y-2">
                      {sectionSubsections.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-800">{sub.name}</p>
                            <p className="text-xs text-green-400">{sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handleSubsectionEdit(sub)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleSubsectionDelete(sub.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-green-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-green-900">{editing ? 'Editar sección' : 'Nueva sección'}</h2>
              <button onClick={() => setShowModal(false)} className="text-green-400 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Ropa de mujer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50" placeholder="ropa-de-mujer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Descripción de la sección" />
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
                <label htmlFor="is_active" className="text-sm text-green-700">Sección activa</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-green-300 text-green-700 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-green-800 text-white rounded-lg font-medium">{editing ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSubsectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-green-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-green-900">{editingSubsection ? 'Editar subsección' : 'Nueva subsección'}</h2>
              <button onClick={() => setShowSubsectionModal(false)} className="text-green-400 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubsectionSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Sección</label>
                <input type="text" value={selectedSection?.name || ''} disabled className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-50 text-green-600" />
                <input type="hidden" value={subsectionFormData.section_id} />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Nombre *</label>
                <input type="text" value={subsectionFormData.name} onChange={(e) => handleSubsectionNameChange(e.target.value)} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Vestidos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Slug</label>
                <input type="text" value={subsectionFormData.slug} onChange={(e) => setSubsectionFormData({ ...subsectionFormData, slug: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50" placeholder="vestidos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Descripción</label>
                <textarea value={subsectionFormData.description} onChange={(e) => setSubsectionFormData({ ...subsectionFormData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Descripción de la subsección" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">URL de imagen</label>
                <input type="url" value={subsectionFormData.image_url} onChange={(e) => setSubsectionFormData({ ...subsectionFormData, image_url: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Orden</label>
                <input type="number" value={subsectionFormData.order} onChange={(e) => setSubsectionFormData({ ...subsectionFormData, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sub_is_active" checked={subsectionFormData.is_active} onChange={(e) => setSubsectionFormData({ ...subsectionFormData, is_active: e.target.checked })} className="w-4 h-4 text-green-800 rounded focus:ring-green-500" />
                <label htmlFor="sub_is_active" className="text-sm text-green-700">Subsección activa</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSubsectionModal(false)} className="flex-1 px-4 py-2.5 border border-green-300 text-green-700 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-green-800 text-white rounded-lg font-medium">{editingSubsection ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminGuard>
  )
}
