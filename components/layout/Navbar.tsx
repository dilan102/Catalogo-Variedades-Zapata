'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User } from 'lucide-react'
import { getSections } from '@/lib/queries'
import AdminModal from '@/components/ui/AdminModal'
import type { Section } from '@/types'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => { getSections().then(setSections).catch(() => {}) }, [])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#DCEFDD] shadow-sm transition-all duration-300 h-16">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#BFEAC5] to-[#5FBE7B] rounded-full flex items-center justify-center overflow-hidden">
              <Image src="/logo.jpg" alt="Variedades Zapata" width={48} height={48} className="object-contain" />
            </div>
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#0F2A1A]">Variedades Zapata</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setAdminOpen(true)} className="p-2 text-[#3E9A60] hover:bg-[#EAF8EC] rounded-xl transition-all duration-200 hover:scale-105">
              <User size={24} />
            </button>
            <button onClick={() => setOpen(true)} className="p-2 text-[#3E9A60] hover:bg-[#EAF8EC] rounded-xl transition-all duration-200 hover:scale-105"><Menu size={24} /></button>
          </div>
        </div>
      </header>
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`fixed bottom-0 sm:top-0 right-0 z-50 h-[80vh] sm:h-full w-full sm:w-96 bg-white shadow-2xl transition-all duration-300 ease-out rounded-t-2xl sm:rounded-none ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCEFDD]">
          <span className="font-serif font-semibold text-[#0F2A1A] text-lg">Menú</span>
          <button onClick={() => setOpen(false)} className="text-[#3E9A60] hover:text-[#1F6B3C] hover:bg-[#EAF8EC] p-2 rounded-xl transition-all duration-200 hover:scale-105"><X size={24} /></button>
        </div>
        <nav className="overflow-y-auto max-h-[calc(80vh-80px)] sm:max-h-[calc(100vh-80px)]">
          <Link href="/" onClick={() => setOpen(false)} className="flex px-6 py-4 text-base font-medium text-[#0F2A1A] hover:bg-[#EAF8EC] border-b border-[#DCEFDD] transition-all duration-200 hover:border-l-2 hover:border-l-[#3E9A60]">Inicio</Link>
          {sections.map((s, i) => (
            <Link 
              key={s.id} 
              href={`/${s.slug}`} 
              onClick={() => setOpen(false)} 
              className="flex px-6 py-4 text-base font-medium text-[#0F2A1A] hover:bg-[#EAF8EC] border-b border-[#DCEFDD] transition-all duration-200 hover:border-l-2 hover:border-l-[#3E9A60]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      </aside>
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  )
}
