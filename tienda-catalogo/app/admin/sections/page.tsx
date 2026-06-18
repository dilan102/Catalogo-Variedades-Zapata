'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import {
  getAllSectionsAdmin,
  upsertSection,
  deleteSection,
} from '@/lib/queries'
import { generateSlug } from '@/lib/utils'
import type { Section } from '@/types'

export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([])
  const [editing, setEditing] = useState<Partial<Section> | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => getAllSectionsAdmin().then(setSections)

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing?.name) return
    setLoading(true)
    try {
      const slug = editing.slug || generateSlug(editing.name)
      await upsertSection({ ...editing, slug })
      setEditing(null)
      load()
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = async (s: Section) => {
    await upsertSection({ ...s, is_active: !s.is_active })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar sección y todo su contenido?')) return
    await deleteSection(id)
    load()
  }

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-stone-900">Secciones</h1>
        <button
          onClick={() => setEditing({ name: '', slug: '', is_active: true, order: sections.length + 1 })}
          className="flex items-center gap-1.5 bg-stone-900 text-white text-sm font-medium px-3 py-2 rounded-xl"
        >
          <Plus size={15} /> Nueva
        </button>
      </div>

      {/* Modal de edición */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4">
            <h2 className="font-semibold text-stone-800">
              {editing.id ? 'Editar sección' : 'Nueva sección'}
            </h2>

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
                placeholder="Ej: Mujer"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Slug (URL)</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="mujer"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Descripción</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Descripción opcional"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">URL de imagen</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.image_url ?? ''}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                placeholder="https://..."
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
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-3 border border-stone-200 text-stone-600 font-medium rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="flex-1 py-3 bg-stone-900 text-white font-semibold rounded-xl text-sm disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {sections.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              s.is_active ? 'border-stone-100 bg-white' : 'border-stone-100 bg-stone-50 opacity-60'
            }`}
          >
            <GripVertical size={16} className="text-stone-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-stone-800 truncate">{s.name}</p>
              <p className="text-xs text-stone-400 font-mono">/{s.slug}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => toggle(s)} className="p-1.5 text-stone-400 hover:text-stone-600">
                {s.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => setEditing(s)} className="p-1.5 text-stone-400 hover:text-stone-700">
                <Pencil size={15} />
              </button>
              <button onClick={() => remove(s.id)} className="p-1.5 text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            No hay secciones. Crea la primera.
          </div>
        )}
      </div>
    </div>
  )
}
