'use client'
import { useState } from 'react'
import Image from 'next/image'
import AdminModal from '@/components/ui/AdminModal'

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false)

  const whatsappNumber = '3054110472'
  const whatsappUrl = `https://wa.me/57${whatsappNumber}`
  const emailAddress = 'variedadeszapata@gmail.com'
  const emailUrl = `mailto:${emailAddress}`
  const facebookUrl = '#'

  const handleModalClose = () => {
    setShowAdminModal(false)
  }

  return (
    <>
      <footer className="bg-[#2A7A4C] text-white py-12 sm:py-16 border-t-2 border-[#8FE0A4]">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Logo y descripción */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#BFEAC5] to-[#5FBE7B] rounded-full flex items-center justify-center overflow-hidden">
                  <Image src="/logo.jpg" alt="Variedades Zapata" width={48} height={48} className="object-contain" />
                </div>
                <span className="font-serif font-semibold text-xl">Variedades Zapata</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Distribuidora mayorista de ropa para negocios.
              </p>
            </div>

            {/* Contacto y redes sociales */}
            <div className="text-center md:text-right">
              <h3 className="font-serif font-semibold text-lg mb-4">Contacto</h3>
              <div className="flex flex-col items-center md:items-end gap-3 mb-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <span>📱</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <span>✉️</span>
                  <span>{emailAddress}</span>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 sm:mt-12 pt-8 text-center">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Variedades Zapata. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      <AdminModal isOpen={showAdminModal} onClose={handleModalClose} />
    </>
  )
}
