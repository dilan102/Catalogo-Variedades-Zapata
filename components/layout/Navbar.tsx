'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { getSections } from '@/lib/queries'
import type { Section } from '@/types'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => { getSections().then(setSections).catch(() => {}) }, [])

  return (
    <>
      <header className="fixed sm:top-0 bottom-0 sm:bottom-auto inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t sm:border-b border-[#6B8E23]/20 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5DC] rounded-full flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Variedades Zapata" width={48} height={48} className="object-contain" />
            </div>
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#556B2F]">Variedades Zapata</span>
          </Link>
          <button onClick={() => setOpen(true)} className="p-2 text-[#6B8E23] hover:bg-[#F5F5DC] rounded-xl transition-all duration-200 hover:scale-105"><Menu size={24} /></button>
        </div>
      </header>
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`fixed bottom-0 sm:top-0 right-0 z-50 h-[80vh] sm:h-full w-full sm:w-96 bg-white shadow-2xl transition-all duration-300 ease-out rounded-t-2xl sm:rounded-none ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#6B8E23]/20">
          <span className="font-serif font-semibold text-[#556B2F] text-lg">Menú</span>
          <button onClick={() => setOpen(false)} className="text-[#6B8E23] hover:text-[#556B2F] hover:bg-[#F5F5DC] p-2 rounded-xl transition-all duration-200 hover:scale-105"><X size={24} /></button>
        </div>
        <nav className="overflow-y-auto max-h-[calc(80vh-80px)] sm:max-h-[calc(100vh-80px)]">
          <Link href="/" onClick={() => setOpen(false)} className="flex px-6 py-4 text-base font-medium text-[#556B2F] hover:bg-[#F5F5DC] border-b border-[#6B8E23]/10 transition-all duration-200 font-serif">Inicio</Link>
          {sections.map((s, i) => (
            <Link 
              key={s.id} 
              href={`/${s.slug}`} 
              onClick={() => setOpen(false)} 
              className="flex px-6 py-4 text-base font-medium text-[#556B2F] hover:bg-[#F5F5DC] border-b border-[#6B8E23]/10 transition-all duration-200 font-serif"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
