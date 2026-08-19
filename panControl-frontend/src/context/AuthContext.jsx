import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('pan_user'))
    } catch {
      return null
    }
  })

  // login recebe os dados do banco enviados pela page login
  const login = useCallback((userData) => {
    setUser(userData)
    sessionStorage.setItem('pan_user', JSON.stringify(userData))
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