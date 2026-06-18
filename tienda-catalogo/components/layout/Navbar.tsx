'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { getSections } from '@/lib/queries'
import type { Section } from '@/types'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    getSections().then(setSections).catch(console.error)
  }, [])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="font-bold text-lg tracking-tight text-stone-900">
            CATÁLOGO
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-stone-600" />
            <button
              onClick={() => setOpen(true)}
              className="p-1 text-stone-700"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer lateral */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <span className="font-semibold text-stone-800">Categorías</span>
          <button onClick={() => setOpen(false)} className="text-stone-500">
            <X size={20} />
          </button>
        </div>
        <nav className="overflow-y-auto h-full pb-20">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-50"
          >
            Inicio
          </Link>
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`/${s.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-50"
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center px-5 py-3 text-sm text-stone-400 hover:bg-stone-50 mt-4"
          >
            ⚙ Admin
          </Link>
        </nav>
      </aside>
    </>
  )
}
