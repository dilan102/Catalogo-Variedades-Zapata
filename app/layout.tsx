import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Preloader from '@/components/layout/Preloader'
import { Analytics } from '@vercel/analytics/next'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  weight: ['500', '600'],
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-cormorant',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = { title: 'Variedades Zapata - Catálogo Premium', description: 'Distribuidora de ropa mayorista. Moda que inspira, calidad que enamora.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${cormorant.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#FAFCF9] text-[#0F2A1A] font-sans">
        <Preloader />
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
