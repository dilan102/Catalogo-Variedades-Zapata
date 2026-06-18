'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { getSections } from '@/lib/queries'
import type { Section } from '@/types'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => { getSections().then(setSections).catch(() => {}) }, [])

  return (
    <>
      <header className="fixed sm:top-0 bottom-0 sm:bottom-auto inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t sm:border-b border-green-100 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-lg sm:text-xl">VZ</span>
            </div>
            <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight text-green-800 hover:text-green-700 transition-colors">Catalogo Variedades Zapata</Link>
          </div>
          <button onClick={() => setOpen(true)} className="p-2 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105"><Menu size={24} /></button>
        </div>
      </header>
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`fixed bottom-0 sm:top-0 right-0 z-50 h-[80vh] sm:h-full w-full sm:w-96 bg-white shadow-2xl transition-all duration-300 ease-out rounded-t-2xl sm:rounded-none ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-green-100">
          <span className="font-semibold text-green-800 text-lg">Categorías</span>
          <button onClick={() => setOpen(false)} className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-xl transition-all duration-200 hover:scale-105"><X size={24} /></button>
        </div>
        <nav className="overflow-y-auto max-h-[calc(80vh-80px)] sm:max-h-[calc(100vh-80px)]">
          <Link href="/" onClick={() => setOpen(false)} className="flex px-6 py-4 text-base font-medium text-green-700 hover:bg-green-50 border-b border-green-50 transition-all duration-200">Inicio</Link>
          {sections.map((s, i) => (
            <Link 
              key={s.id} 
              href={`/${s.slug}`} 
              onClick={() => setOpen(false)} 
              className="flex px-6 py-4 text-base font-medium text-green-700 hover:bg-green-50 border-b border-green-50 transition-all duration-200"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {s.name}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} className="flex px-6 py-4 text-base text-green-400 hover:bg-green-50 hover:text-green-600 mt-4 transition-all duration-200">⚙ Admin</Link>
        </nav>
      </aside>
    </>
  )
}
