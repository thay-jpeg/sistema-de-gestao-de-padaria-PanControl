export const ROLES = {
  GESTOR: 'GESTOR',
  ATENDENTE: 'ATENDENTE',
  PRODUTOR: 'PRODUTOR'
}

export function canAccess(perfil, moduleKey) {
  if (!perfil) return false;

  const p = perfil.toUpperCase();

  if (p === 'GESTOR') return true;

  if (p === 'ATENDENTE') {
    return ['vendas', 'catalogo'].includes(moduleKey);
  }
  if (p === 'PRODUTOR') {
    return ['catalogo', 'producao'].includes(moduleKey);
  }

  return false;
}