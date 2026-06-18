'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layers, Tag, Package, Plus } from 'lucide-react'
import { getAllSectionsAdmin, getAllSubsectionsAdmin, getAllProductsAdmin } from '@/lib/queries'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ sections: 0, subsections: 0, products: 0 })

  useEffect(() => {
    Promise.all([
      getAllSectionsAdmin(),
      getAllSubsectionsAdmin(),
      getAllProductsAdmin(),
    ]).then(([s, sub, p]) => {
      setCounts({ sections: s.length, subsections: sub.length, products: p.length })
    })
  }, [])

  const cards = [
    {
      label: 'Secciones',
      count: counts.sections,
      icon: Layers,
      href: '/admin/sections',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Subsecciones',
      count: counts.subsections,
      icon: Tag,
      href: '/admin/subsections',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Productos',
      count: counts.products,
      icon: Package,
      href: '/admin/products',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="px-4 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">Panel Admin</h1>
        <p className="text-sm text-stone-400 mt-0.5">Gestiona tu catálogo</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {cards.map(({ label, count, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-xl shadow-sm active:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400">{count} elementos</p>
              </div>
            </div>
            <Plus size={18} className="text-stone-300" />
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="text-xs text-stone-400 underline underline-offset-2"
        >
          ← Ver catálogo público
        </Link>
      </div>
    </div>
  )
}
