import { createContext, useContext, useState, useCallback } from 'react'
import { authenticateUser } from '@/mocks/data/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pan_user')) } catch { return null }
  })

  const login = useCallback((code, password) => {
    const found = authenticateUser(code, password)
    if (found) {
      setUser(found)
      sessionStorage.setItem('pan_user', JSON.stringify(found))
      return { ok: true, user: found }
    }
    return { ok: false, error: 'Usuário ou senha inválidos.' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('pan_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
