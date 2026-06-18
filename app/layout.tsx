import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Great_Vibes, Allura, Parisienne, Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({ 
  subsets: ['latin'], 
  variable: '--font-great-vibes',
  display: 'swap',
  weight: ['400'],
})

const allura = Allura({ 
  subsets: ['latin'], 
  variable: '--font-allura',
  display: 'swap',
  weight: ['400'],
})

const parisienne = Parisienne({ 
  subsets: ['latin'], 
  variable: '--font-parisienne',
  display: 'swap',
  weight: ['400'],
})

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const poppins = Poppins({ 
  subsets: ['latin'], 
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = { title: 'Variedades Zapata - Catálogo Premium', description: 'Distribuidora de ropa mayorista. Moda que inspira, calidad que enamora.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable} ${allura.variable} ${parisienne.variable} ${inter.variable} ${poppins.variable}`}>
      <body className="bg-white text-green-900 font-sans">
        <Navbar />
        <main className="pt-16 pb-20 sm:pb-0 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
