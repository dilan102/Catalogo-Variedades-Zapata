'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Lock, User as UserIcon } from 'lucide-react'

export default function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Autenticación básica (puedes cambiar esto por tu sistema real)
    if (username === 'VariedadesZ' && password === 'VZKZ') {
      // Guardar sesión en localStorage
      localStorage.setItem('adminAuth', 'true')
      setLoading(false)
      onClose()
      router.push('/admin')
    } else {
      setError('Credenciales incorrectas')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      <div className="relative glass-card bg-white/90 w-full max-w-md p-8 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5C7A66] hover:text-[#0F2A1A] transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#BFEAC5] to-[#5FBE7B] rounded-full flex items-center justify-center">
            <UserIcon size={32} className="text-[#1F6B3C]" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#0F2A1A] mb-2">Acceso Administrador</h2>
          <p className="text-sm text-[#5C7A66]">Ingresa tus credenciales para gestionar el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0F2A1A] mb-2">Usuario</label>
            <div className="relative">
              <UserIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C7A66]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#DCEFDD] rounded-xl focus:outline-none focus:border-[#3E9A60] focus:ring-2 focus:ring-[#3E9A60]/20 transition-all"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F2A1A] mb-2">Contraseña</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C7A66]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#DCEFDD] rounded-xl focus:outline-none focus:border-[#3E9A60] focus:ring-2 focus:ring-[#3E9A60]/20 transition-all"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#5C7A66]">
            Credenciales: VariedadesZ / VZKZ
          </p>
        </div>
      </div>
    </div>
  )
}
