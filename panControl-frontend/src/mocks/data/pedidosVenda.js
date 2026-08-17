/**
 * Pedidos de venda atacadista (clientesAtacadistas).
 * situacao: 'rascunho' | 'confirmado' | 'entregue' | 'cancelado'
 */
export const PEDIDOS_VENDA = [
  {
    id: 'PV001', situacao: 'confirmado', dataPedido: '09/08/2026', valorTotal: 150.00,
    idClienteAtacadista: '00000040', nomeCliente: 'Maria Fernanda',
    idUsuario: 'USR002',
    itens: [
      { idProduto: '001', nomeProduto: 'Pão Francês',   quantidade: 200, precoUnitarioAplicado: 0.50 },
      { idProduto: '003', nomeProduto: 'Pão Forma',      quantidade: 10,  precoUnitarioAplicado: 5.50 },
    ],
  },
  {
    id: 'PV002', situacao: 'rascunho', dataPedido: '10/08/2026', valorTotal: 84.00,
    idClienteAtacadista: '00000041', nomeCliente: 'Ricardo Alves',
    idUsuario: 'USR001',
    itens: [
      { idProduto: '002', nomeProduto: 'Pão Caseiro', quantidade: 6, precoUnitarioAplicado: 14.00 },
    ],
  },
  {
    id: 'PV003', situacao: 'entregue', dataPedido: '05/08/2026', valorTotal: 240.00,
    idClienteAtacadista: '00000040', nomeCliente: 'Maria Fernanda',
    idUsuario: 'USR002',
    itens: [
      { idProduto: '001', nomeProduto: 'Pão Francês', quantidade: 300, precoUnitarioAplicado: 0.50 },
      { idProduto: '006', nomeProduto: 'Cacetinho',   quantidade: 150, precoUnitarioAplicado: 0.42 },
    ],
  },
]
