import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AdminButton from '@/components/ui/AdminButton'

export const metadata: Metadata = { title: 'Catalogo Variedades Zapata', description: 'Catálogo de productos' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-green-900">
        <Navbar />
        <main className="pt-16 pb-20 sm:pb-0 min-h-screen">{children}</main>
        <AdminButton />
      </body>
    </html>
  )
}
