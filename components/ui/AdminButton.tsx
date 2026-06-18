'use client'
import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { login, logout, isAuthenticated } from '@/lib/auth'

export default function AdminButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      setIsLoggedIn(true)
      setShowLogin(false)
      setUsername('')
      setPassword('')
      setError('')
      window.location.href = '/admin'
    } else {
      setError('Credenciales incorrectas')
    }
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  return (
    <>
      <button
        onClick={() => isLoggedIn ? window.location.href = '/admin' : setShowLogin(true)}
        className="fixed bottom-4 right-4 z-30 opacity-30 hover:opacity-100 transition-opacity bg-green-800 text-white p-2 rounded-full shadow-lg"
        title="Administrador"
      >
        <Lock size={16} />
      </button>

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-green-900 mb-4">Acceso Administrador</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setUsername(''); setPassword(''); setError('') }}
                  className="flex-1 px-4 py-2 border border-green-300 text-green-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-800 text-white rounded-lg font-medium"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
