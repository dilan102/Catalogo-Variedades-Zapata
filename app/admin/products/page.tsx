'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, GripVertical, ChevronLeft, Star } from 'lucide-react'
import { getAllProductsAdmin, getAllSubsectionsAdmin, upsertProduct, deleteProduct } from '@/lib/queries'
import type { Product, Subsection } from '@/types'
import AdminGuard from '@/components/ui/AdminGuard'

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    subsection_id: '',
    name: '',
    description: '',
    price: '',
    images: '',
    sizes: '',
    colors: '',
    is_active: true,
    is_featured: false,
    order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [prods, subs] = await Promise.all([getAllProductsAdmin(), getAllSubsectionsAdmin()])
      setProducts(prods)
      setSubsections(subs)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const images = formData.images.split('\n').map(s => s.trim()).filter(Boolean)
      const sizes = formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
      const colors = formData.colors.split(',').map(s => s.trim()).filter(Boolean)
      
      await upsertProduct({
        ...formData,
        id: editing?.id,
        price: formData.price ? parseFloat(formData.price) : null,
        images,
        sizes,
        colors
      })
      setShowModal(false)
      setEditing(null)
      setFormData({
        subsection_id: '',
        name: '',
        description: '',
        price: '',
        images: '',
        sizes: '',
        colors: '',
        is_active: true,
        is_featured: false,
        order: 0
      })
      loadData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto')
    }
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    setFormData({
      subsection_id: product.subsection_id,
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      images: product.images.join('\n'),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      is_active: product.is_active,
      is_featured: product.is_featured,
      order: product.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await deleteProduct(id)
      loadData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  const getSubsectionName = (subsectionId: string) => {
    const subsection = subsections.find(s => s.id === subsectionId)
    return subsection?.name || subsectionId
  }

  const getSectionName = (subsectionId: string) => {
    const subsection = subsections.find(s => s.id === subsectionId)
    return subsection?.section?.name || ''
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
          <h1 className="text-lg font-bold text-green-900">Productos</h1>
          <button onClick={() => { setEditing(null); setFormData({ subsection_id: '', name: '', description: '', price: '', images: '', sizes: '', colors: '', is_active: true, is_featured: false, order: products.length }); setShowModal(true) }} className="flex items-center gap-1.5 bg-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium">
            <Plus size={18} />
            <span className="hidden sm:inline">Nuevo</span>
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
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-green-400 text-sm mb-4">No hay productos aún</p>
            {subsections.length === 0 ? (
              <p className="text-green-500 text-sm">Primero crea una subsección</p>
            ) : (
              <button onClick={() => { setEditing(null); setFormData({ subsection_id: subsections[0].id, name: '', description: '', price: '', images: '', sizes: '', colors: '', is_active: true, is_featured: false, order: 0 }); setShowModal(true) }} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Crear primer producto
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {product.images?.[0] && (
                      <div className="w-16 h-16 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-green-900">{product.name}</h3>
                        {product.is_featured && <Star size={14} className="text-green-600 fill-green-600" />}
                      </div>
                      <p className="text-xs text-green-500 mt-0.5">{getSectionName(product.subsection_id)} / {getSubsectionName(product.subsection_id)}</p>
                      {product.price !== null && <p className="text-sm font-semibold text-green-700 mt-1">${product.price.toLocaleString()}</p>}
                      {product.description && <p className="text-sm text-green-600 mt-1 line-clamp-2">{product.description}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {product.sizes.length > 0 && <span className="text-xs text-green-400">Tallas: {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</span>}
                        {product.colors.length > 0 && <span className="text-xs text-green-400">Colores: {product.colors.slice(0, 3).join(', ')}{product.colors.length > 3 ? '...' : ''}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-500'}`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-xs text-green-400">Orden: {product.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(product)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
              <h2 className="text-lg font-bold text-green-900">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setShowModal(false)} className="text-green-400 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Subsección *</label>
                <select value={formData.subsection_id} onChange={(e) => setFormData({ ...formData, subsection_id: e.target.value })} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecciona una subsección</option>
                  {subsections.map((s) => (
                    <option key={s.id} value={s.id}>{s.section?.name} / {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Vestido floral" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Descripción del producto" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Precio</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Imágenes (una por línea)</label>
                <textarea value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} rows={4} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Tallas (separadas por coma)</label>
                <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="S, M, L, XL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Colores (separados por coma)</label>
                <input type="text" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rojo, Azul, Negro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Orden</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-green-800 rounded focus:ring-green-500" />
                  <span className="text-sm text-green-700">Producto activo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                  <span className="text-sm text-green-700">Destacado</span>
                </label>
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
