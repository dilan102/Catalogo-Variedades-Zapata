'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Auto-login con credenciales por defecto
    login('VariedadesZ', 'VZKZ')
  }, [])

  return <>{children}</>
}
