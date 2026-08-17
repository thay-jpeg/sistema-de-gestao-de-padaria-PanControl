/**
 * Cada registro = um lote de compra de ingrediente.
 * dataValidade: validade do lote — influencia a validade do produto produzido.
 * quantidadeRestante: decrementada conforme o ingrediente é consumido em produções.
 */
export const COMPRAS_INGREDIENTES = [
  { id: 'CI001', ingredienteId: '001', quantidadeComprada: 10, dataValidade: '17/08/2026', quantidadeRestante: 8,   custoTotal: 89.90, custoUnitario: 8.99, dataCompra: '01/07/2026', idUsuario: 'USR001' },
  { id: 'CI002', ingredienteId: '001', quantidadeComprada: 5,  dataValidade: '30/08/2026', quantidadeRestante: 4,   custoTotal: 44.95, custoUnitario: 8.99, dataCompra: '15/07/2026', idUsuario: 'USR001' },
  { id: 'CI003', ingredienteId: '002', quantidadeComprada: 6,  dataValidade: '01/12/2026', quantidadeRestante: 6,   custoTotal: 17.90, custoUnitario: 2.98, dataCompra: '01/07/2026', idUsuario: 'USR001' },
  { id: 'CI004', ingredienteId: '003', quantidadeComprada: 500,dataValidade: '30/09/2026', quantidadeRestante: 300, custoTotal: 69.50, custoUnitario: 0.139,dataCompra: '01/07/2026', idUsuario: 'USR001' },
  { id: 'CI005', ingredienteId: '004', quantidadeComprada: 1000,dataValidade:'01/01/2027', quantidadeRestante: 500, custoTotal: 3.50,  custoUnitario: 0.0035,dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI006', ingredienteId: '005', quantidadeComprada: 500, dataValidade: '10/08/2026', quantidadeRestante: 500, custoTotal: 5.90, custoUnitario: 0.0118, dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI007', ingredienteId: '006', quantidadeComprada: 3000,dataValidade: '20/08/2026', quantidadeRestante: 2000,custoTotal: 14.70, custoUnitario: 0.0049, dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI008', ingredienteId: '007', quantidadeComprada: 24,  dataValidade: '10/08/2026', quantidadeRestante: 24,  custoTotal: 25.80, custoUnitario: 1.075,  dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI009', ingredienteId: '008', quantidadeComprada: 800, dataValidade: '27/11/2026', quantidadeRestante: 800, custoTotal: 34.00, custoUnitario: 0.0425, dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI010', ingredienteId: '009', quantidadeComprada: 500, dataValidade: '25/09/2026', quantidadeRestante: 300, custoTotal: 18.90, custoUnitario: 0.0378, dataCompra:'01/07/2026', idUsuario: 'USR001' },
  { id: 'CI011', ingredienteId: '010', quantidadeComprada: 1800,dataValidade: '22/01/2027', quantidadeRestante: 1800,custoTotal: 13.80, custoUnitario: 0.00767,dataCompra:'01/07/2026', idUsuario: 'USR001' },
]
