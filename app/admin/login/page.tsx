'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { parseJsonResponse } from '@/lib/utils'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await parseJsonResponse<{ success: boolean; message?: string }>(response)

      if (data.success) {
        if (window.history.length > 1) {
          router.back()
        } else {
          router.push('/')
        }
        router.refresh()
        return
      }

      setError(data.message || 'Credenciales incorrectas')
    } catch {
      setError('No se pudo completar el inicio de sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFCF9] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#DCEFDD] shadow-sm p-8">
          <h1 className="text-2xl font-serif font-bold text-[#0F2A1A] mb-2 text-center">Acceso Admin</h1>
          <p className="text-sm text-[#5C7A66] mb-6 text-center">Variedades Zapata</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2A1A] mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full px-4 py-2 border border-[#DCEFDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E9A60]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F2A1A] mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2 border border-[#DCEFDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E9A60]"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3E9A60] text-white py-2.5 rounded-lg font-medium hover:bg-[#2A7A4C] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#5C7A66] hover:text-[#3E9A60] transition-colors">
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
