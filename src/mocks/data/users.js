import { ROLES } from '@/config/permissions'

// Simula base de usuários. Substitua por chamada à API quando o back estiver pronto.
const USERS = [
  { id: 'USR001', code: '0001', password: '1234', name: 'Carlos Silva',   role: ROLES.GESTOR    },
  { id: 'USR002', code: '0002', password: '1234', name: 'Ana Souza',      role: ROLES.ATENDENTE },
  { id: 'USR003', code: '0003', password: '1234', name: 'João Pereira',   role: ROLES.PRODUTOR  },
]

export function authenticateUser(code, password) {
  return USERS.find(u => u.code === code && u.password === password) || null
}
