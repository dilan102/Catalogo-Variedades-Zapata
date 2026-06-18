'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import {
  getAllProductsAdmin,
  getAllSubsectionsAdmin,
  upsertProduct,
  deleteProduct,
} from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import type { Product, Subsection } from '@/types'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [loading, setLoading] = useState(false)
  const [sizesInput, setSizesInput] = useState('')
  const [colorsInput, setColorsInput] = useState('')
  const [imagesInput, setImagesInput] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    const [prods, subs] = await Promise.all([getAllProductsAdmin(), getAllSubsectionsAdmin()])
    setProducts(prods)
    setSubsections(subs)
  }

  useEffect(() => { load() }, [])

  const openEdit = (p?: Partial<Product>) => {
    const base = p ?? { name: '', is_active: true, is_featured: false, order: 0, images: [], sizes: [], colors: [] }
    setEditing(base)
    setSizesInput((base.sizes ?? []).join(', '))
    setColorsInput((base.colors ?? []).join(', '))
    setImagesInput((base.images ?? []).join('\n'))
  }

  const save = async () => {
    if (!editing?.name || !editing?.subsection_id) return
    setLoading(true)
    try {
      await upsertProduct({
        ...editing,
        sizes: sizesInput.split(',').map((s) => s.trim()).filter(Boolean),
        colors: colorsInput.split(',').map((s) => s.trim()).filter(Boolean),
        images: imagesInput.split('\n').map((s) => s.trim()).filter(Boolean),
      })
      setEditing(null)
      load()
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = async (p: Product) => {
    await upsertProduct({ ...p, is_active: !p.is_active })
    load()
  }

  const toggleFeatured = async (p: Product) => {
    await upsertProduct({ ...p, is_featured: !p.is_featured })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    load()
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-stone-900">Productos</h1>
        <button
          onClick={() => openEdit()}
          className="flex items-center gap-1.5 bg-stone-900 text-white text-sm font-medium px-3 py-2 rounded-xl"
        >
          <Plus size={15} /> Nuevo
        </button>
      </div>

      {/* Búsqueda */}
      <input
        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 mb-4"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end overflow-hidden">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-stone-800 sticky top-0 bg-white pb-2">
              {editing.id ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Subsección *</label>
              <select
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
                value={editing.subsection_id ?? ''}
                onChange={(e) => setEditing({ ...editing, subsection_id: e.target.value })}
              >
                <option value="">Selecciona una subsección</option>
                {subsections.map((s) => {
                  const sec = (s as any).section
                  return (
                    <option key={s.id} value={s.id}>
                      {sec?.name} › {s.name}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Nombre *</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.name ?? ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Descripción</label>
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
                rows={3}
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Descripción del producto"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Precio (COP)</label>
              <input
                type="number"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={editing.price ?? ''}
                onChange={(e) => setEditing({ ...editing, price: +e.target.value })}
                placeholder="89900"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">
                Tallas <span className="text-stone-400 font-normal">(separadas por coma)</span>
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="XS, S, M, L, XL"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">
                Colores <span className="text-stone-400 font-normal">(separados por coma)</span>
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                placeholder="Negro, Blanco, Rojo"
              />
            </div>

            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">
                URLs de imágenes <span className="text-stone-400 font-normal">(una por línea)</span>
              </label>
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none font-mono"
                rows={4}
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder={'https://imagen1.jpg\nhttps://imagen2.jpg'}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_featured ?? false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  className="rounded"
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active ?? true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="rounded"
                />
                Activo
              </label>
            </div>

            <div className="flex gap-2 pt-1 pb-4">
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
        {filtered.map((p) => {
          const sub = (p as any).subsection
          const sec = sub?.section
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-xl border ${p.is_active ? 'border-stone-100 bg-white' : 'border-stone-100 bg-stone-50 opacity-60'}`}
            >
              {/* Miniatura */}
              <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0 overflow-hidden">
                {p.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-stone-800 truncate">{p.name}</p>
                <p className="text-xs text-stone-400 truncate">
                  {sec?.name} › {sub?.name}
                  {p.price != null && ` · ${formatPrice(p.price)}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleFeatured(p)} className={`p-1.5 ${p.is_featured ? 'text-amber-400' : 'text-stone-300'}`}>
                  <Star size={15} fill={p.is_featured ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => toggle(p)} className="p-1.5 text-stone-400">
                  {p.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 text-stone-400">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove(p.id)} className="p-1.5 text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            {search ? 'No se encontraron productos.' : 'No hay productos aún.'}
          </div>
        )}
      </div>
    </div>
  )
}
