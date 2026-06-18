'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import {
  getAllSubsectionsAdmin,
  getAllSectionsAdmin,
  upsertSubsection,
  deleteSubsection,
} from '@/lib/queries'
import { generateSlug } from '@/lib/utils'
import type { Section, Subsection } from '@/types'

export default function AdminSubsections() {
  const [items, setItems] = useState<Subsection[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [editing, setEditing] = useState<Partial<Subsection> | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterSection, setFilterSection] = useState<string>('all')

  const load = async () => {
    const [subs, secs] = await Promise.all([getAllSubsectionsAdmin(), getAllSectionsAdmin()])
    setItems(subs)
    setSections(secs)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing?.name || !editing?.section_id) return
    setLoading(true)
    try {
      const slug = editing.slug || generateSlug(editing.name)
      await upsertSubsection({ ...editing, slug })
      setEditing(null)
      load()
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = async (s: Subsection) => {
    await upsertSubsection({ ...s, is_active: !s.is_active })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar subsección y sus productos?')) return
    await deleteSubsection(id)
    load()
  }

  const filtered = filterSection === 'all'
    ? items
    : items.filter((i) => i.section_id === filterSection)

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-stone-900">Subsecciones</h1>
        <button
          onClick={() => setEditing({ name: '', slug: '', is_active: true, order: 0 })}
          className="flex items-center gap-1.5 bg-stone-900 text-white text-sm font-medium px-3 py-2 rounded-xl"
        >
          <Plus size={15} /> Nueva
        </button>
      </div>

      {/* Filtro por sección */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button
          onClick={() => setFilterSection('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterSection === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          Todas
        </button>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterSection(s.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterSection === s.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4">
            <h2 className="font-semibold text-stone-800">
              {editing.id ? 'Editar subsección' : 'Nueva subsección'}
            </h2>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Sección padre *</label>
              <select
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
                value={editing.section_id ?? ''}
                onChange={(e) => setEditing({ ...editing, section_id: e.target.value })}
              >
                <option value="">Selecciona una sección</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Nombre *</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.name ?? ''}
                onChange={(e) => setEditing({
                  ...editing,
                  name: e.target.value,
                  slug: editing.id ? editing.slug : generateSlug(e.target.value),
                })}
                placeholder="Ej: Vestidos"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Slug</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="vestidos"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Descripción</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Orden</label>
              <input
                type="number"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: +e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 border border-stone-200 text-stone-600 font-medium rounded-xl text-sm">
                Cancelar
              </button>
              <button onClick={save} disabled={loading} className="flex-1 py-3 bg-stone-900 text-white font-semibold rounded-xl text-sm disabled:opacity-50">
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {filtered.map((s) => {
          const parentSection = (s as any).section
          return (
            <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border ${s.is_active ? 'border-stone-100 bg-white' : 'border-stone-100 bg-stone-50 opacity-60'}`}>
              <GripVertical size={16} className="text-stone-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-stone-800 truncate">{s.name}</p>
                <p className="text-xs text-stone-400 truncate">
                  {parentSection?.name} · <span className="font-mono">/{s.slug}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(s)} className="p-1.5 text-stone-400">
                  {s.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => setEditing(s)} className="p-1.5 text-stone-400">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove(s.id)} className="p-1.5 text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            No hay subsecciones {filterSection !== 'all' ? 'en esta sección' : ''}.
          </div>
        )}
      </div>
    </div>
  )
}
