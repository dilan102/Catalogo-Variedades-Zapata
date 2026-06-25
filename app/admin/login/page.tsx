'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      router.push('/admin')
    } else {
      setError('Credenciales incorrectas')
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
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-[#DCEFDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E9A60]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F2A1A] mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#DCEFDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E9A60]"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#3E9A60] text-white py-2.5 rounded-lg font-medium hover:bg-[#2A7A4C] transition-colors"
            >
              Ingresar
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#5C7A66] hover:text-[#3E9A60] transition-colors">
              ← Volver al sitio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
