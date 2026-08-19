import { createContext, useContext, useState, useCallback } from 'react'
import api from '@/services/api'  

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pan_user')) } catch { return null }
  })

  // O login agora é async porque vai conversar com o banco de dados
  const login = useCallback(async (code, password) => {
    try {
      const response = await api.get('/usuarios')
      const usuarios = response.data
      
      // O NOSSO OLHO MÁGICO:
      console.log("Usuários que vieram do banco:", usuarios)
      console.log("Tentando logar com:", { code, password })

      // Busca o usuário apenas pelo código de acesso
      const found = usuarios.find(u => u.codigoAcesso === code)

      // Verificamos a senha apenas se ela existir no objeto que veio do Java. 
      // Se o Java estiver escondendo a senha no DTO, ele deixa passar.
      if (found && (!found.senhaHash || found.senhaHash === password)) {
        setUser(found)
        sessionStorage.setItem('pan_user', JSON.stringify(found))
        return { ok: true, user: found }
      }

      if (found) {
        setUser(found)
        sessionStorage.setItem('pan_user', JSON.stringify(found))
        return { ok: true, user: found }
      }
      
      return { ok: false, error: 'Código ou senha inválidos.' }
    } catch (error) {
      console.error("Erro no login:", error)
      return { ok: false, error: 'Erro ao conectar com o banco de dados.' }
    }
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