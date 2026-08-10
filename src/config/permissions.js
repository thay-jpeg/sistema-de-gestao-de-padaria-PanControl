// Perfis disponíveis
export const ROLES = {
  GESTOR: 'Gestor',
  ATENDENTE: 'Atendente',
  PRODUTOR: 'Produtor',
}

// Quais módulos cada perfil pode acessar
// key = rota / identificador do módulo
export const PERMISSIONS = {
  [ROLES.GESTOR]:    ['vendas', 'catalogo', 'producao', 'relatorios', 'gerenciamento'],
  [ROLES.ATENDENTE]: ['vendas', 'catalogo'],
  [ROLES.PRODUTOR]:  ['producao', 'catalogo'],
}

export function canAccess(role, module) {
  return (PERMISSIONS[role] || []).includes(module)
}
