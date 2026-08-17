/**
 * Cada registro = produção de UM produto (idProduto_FK único conforme MER).
 * dataValidadeLote = min(dataProducao + diasValidadePadrao, min(validades dos lotes usados))
 */
export const PRODUCTIONS = [
  {
    id: 'PRD001', code: 'PRD001', idProduto: '001', nomeProduto: 'Pão Francês',
    quantidadeProduzida: 200, custoTotalProducao: 8.50,
    dataProducao: '09/08/2026', dataValidadeLote: '11/08/2026', idUsuario: 'USR003',
  },
  {
    id: 'PRD002', code: 'PRD002', idProduto: '003', nomeProduto: 'Pão Forma',
    quantidadeProduzida: 20, custoTotalProducao: 32.10,
    dataProducao: '09/08/2026', dataValidadeLote: '14/08/2026', idUsuario: 'USR003',
  },
]
