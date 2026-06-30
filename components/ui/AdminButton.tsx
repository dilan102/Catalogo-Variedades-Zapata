'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'

export default function AdminButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      try {
        const response = await fetch('/api/me')
        const data = await response.json()

        if (active) {
          setIsLoggedIn(Boolean(data.authenticated))
        }
      } catch {
        if (active) {
          setIsLoggedIn(false)
        }
      } finally {
        if (active) {
          setIsChecking(false)
        }
      }
    }

    void verifySession()

    return () => {
      active = false
    }
  }, [])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsLoggedIn(true)
        setShowLogin(false)
        setUsername('')
        setPassword('')
        setError('')
        window.location.assign('/admin')
        return
      }

      setError(data.message || 'Credenciales incorrectas')
    } catch {
      setError('No se pudo completar el inicio de sesión')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } finally {
      setIsLoggedIn(false)
      setShowLogin(false)
    }
  }

  return (
    <>
      <button
        onClick={() => isLoggedIn ? window.location.assign('/admin') : setShowLogin(true)}
        className="fixed bottom-4 right-4 z-30 opacity-30 hover:opacity-100 transition-opacity bg-green-800 text-white p-2 rounded-full shadow-lg"
        title="Administrador"
        disabled={isChecking}
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
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-16 z-30 opacity-30 hover:opacity-100 transition-opacity bg-white text-green-800 border border-green-200 px-3 py-2 rounded-full shadow-lg text-sm"
        >
          Salir
        </button>
      )}
    </>
  )
}
