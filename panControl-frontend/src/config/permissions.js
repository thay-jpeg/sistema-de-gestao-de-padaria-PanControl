export const ROLES = {
  GESTOR:    'Gestor',
  ATENDENTE: 'Atendente',
  PRODUTOR:  'Produtor',
}

export const PERMISSIONS = {
  [ROLES.GESTOR]:    ['vendas', 'catalogo', 'producao', 'relatorios', 'gerenciamento', 'pedidosVenda'],
  [ROLES.ATENDENTE]: ['vendas', 'catalogo'],
  [ROLES.PRODUTOR]:  ['producao', 'catalogo'],
}

export function canAccess(role, module) {
  return (PERMISSIONS[role] || []).includes(module)
}
