'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layers, Tag, Package } from 'lucide-react'
import { getAllSectionsAdmin, getAllSubsectionsAdmin, getAllProductsAdmin } from '@/lib/queries'
import AdminGuard from '@/components/ui/AdminGuard'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ sections: 0, subsections: 0, products: 0 })

  useEffect(() => {
    Promise.all([getAllSectionsAdmin(), getAllSubsectionsAdmin(), getAllProductsAdmin()])
      .then(([s, sub, p]) => setCounts({ sections: s.length, subsections: sub.length, products: p.length }))
      .catch(() => {})
  }, [])

  return (
    <AdminGuard>
      <div className="px-4 py-5 max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-green-900 mb-1">Panel Admin</h1>
        <p className="text-sm text-green-600 mb-6">Gestiona tu catálogo</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Secciones', count: counts.sections, icon: Layers, href: '/admin/sections', color: 'bg-green-50 text-green-600' },
            { label: 'Subsecciones', count: counts.subsections, icon: Tag, href: '/admin/subsections', color: 'bg-green-100 text-green-700' },
            { label: 'Productos', count: counts.products, icon: Package, href: '/admin/products', color: 'bg-green-200 text-green-800' },
          ].map(({ label, count, icon: Icon, href, color }) => (
            <Link key={label} href={href} className="flex items-center justify-between p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${color}`}><Icon size={20} /></div>
                <div>
                  <p className="font-semibold text-green-900">{label}</p>
                  <p className="text-xs text-green-500">{count} elementos</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/" className="block text-xs text-green-500 underline mt-6 hover:text-green-700 transition-colors">← Ver catálogo público</Link>
      </div>
    </AdminGuard>
  )
}
