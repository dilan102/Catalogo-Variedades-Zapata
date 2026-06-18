const CREDENTIALS = {
  username: 'VariedadesZ',
  password: 'VZKZ'
}

export function login(username: string, password: string): boolean {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_auth', 'true')
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_auth')
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_auth') === 'true'
  }
  return false
}
