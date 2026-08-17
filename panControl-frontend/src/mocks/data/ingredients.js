/**
 * ingredientes — tabela base do ingrediente.
 * Validade NÃO fica aqui; fica em comprasIngredientes.dataValidade por lote.
 * custoMedioUnitario é atualizado a cada compra (média ponderada).
 */
export const INGREDIENTS = [
  { id: '001', code: '001', name: 'Farinha de Trigo', unidadeMedida: 'kg', quantidadeEstoque: 12, estoqueMinimo: 5, custoMedioUnitario: 8.99 },
  { id: '002', code: '002', name: 'Açúcar Cristal',   unidadeMedida: 'kg', quantidadeEstoque: 6,  estoqueMinimo: 3, custoMedioUnitario: 2.98 },
  { id: '003', code: '003', name: 'Fermento Biológico Seco', unidadeMedida: 'g', quantidadeEstoque: 300, estoqueMinimo: 100, custoMedioUnitario: 0.14 },
  { id: '004', code: '004', name: 'Sal Refinado',     unidadeMedida: 'g', quantidadeEstoque: 500, estoqueMinimo: 200, custoMedioUnitario: 0.004 },
  { id: '005', code: '005', name: 'Margarina',        unidadeMedida: 'g', quantidadeEstoque: 500, estoqueMinimo: 200, custoMedioUnitario: 0.012 },
  { id: '006', code: '006', name: 'Leite Integral',   unidadeMedida: 'ml', quantidadeEstoque: 2000, estoqueMinimo: 500, custoMedioUnitario: 0.0049 },
  { id: '007', code: '007', name: 'Ovos',             unidadeMedida: 'un', quantidadeEstoque: 24, estoqueMinimo: 12, custoMedioUnitario: 1.075 },
  { id: '008', code: '008', name: 'Coco Ralado',      unidadeMedida: 'g', quantidadeEstoque: 800, estoqueMinimo: 200, custoMedioUnitario: 0.0425 },
  { id: '009', code: '009', name: 'Manteiga sem Sal', unidadeMedida: 'g', quantidadeEstoque: 300, estoqueMinimo: 100, custoMedioUnitario: 0.0378 },
  { id: '010', code: '010', name: 'Óleo de Soja',     unidadeMedida: 'ml', quantidadeEstoque: 1800, estoqueMinimo: 500, custoMedioUnitario: 0.00767 },
]

export function getIngredientById(id) {
  return INGREDIENTS.find(i => i.id === id) || null
}
