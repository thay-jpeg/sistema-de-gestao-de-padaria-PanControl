/**
 * fichasTecnica: lista de { ingredienteId, quantidade } — referencia ingredientes.id
 * diasValidadePadrao: número de dias a partir da data de produção
 * precoBalcao / precoAtacado: preços separados por canal
 * percentualICMS, percentualLucroBalcao, percentualLucroAtacado: margens
 * textoReceita: texto livre do modo de preparo (fichasTecnicas.textoReceita no MER)
 */
export const PRODUCTS = [
  {
    id: '001', code: '110', name: 'Pão Francês', codigoBarras: '7891234560001',
    percentualICMS: 7, percentualLucroBalcao: 150, percentualLucroAtacado: 80,
    precoBalcao: 0.75, precoAtacado: 0.50, quantidadeEstoque: 10,
    diasValidadePadrao: 2,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.05 },
      { ingredienteId: '002', quantidade: 0.003 },
      { ingredienteId: '003', quantidade: 1.5 },
      { ingredienteId: '004', quantidade: 1.0 },
      { ingredienteId: '005', quantidade: 3.0 },
    ],
    textoReceita: 'Dilua o fermento em água morna com o açúcar. Misture os outros ingredientes. Amasse por 10 min. Deixe descansar 1h. Modele e asse a 220°C por 20 min.',
    image: null,
  },
  {
    id: '002', code: '092', name: 'Pão Caseiro', codigoBarras: '7891234560002',
    percentualICMS: 7, percentualLucroBalcao: 120, percentualLucroAtacado: 70,
    precoBalcao: 19.90, precoAtacado: 14.00, quantidadeEstoque: 8,
    diasValidadePadrao: 4,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.5 },
      { ingredienteId: '006', quantidade: 200 },
      { ingredienteId: '007', quantidade: 2 },
      { ingredienteId: '009', quantidade: 50 },
    ],
    textoReceita: 'Misture todos os ingredientes até obter uma massa lisa. Asse a 180°C por 40 minutos.',
    image: null,
  },
  {
    id: '003', code: '115', name: 'Pão Forma', codigoBarras: '7891234560003',
    percentualICMS: 7, percentualLucroBalcao: 110, percentualLucroAtacado: 65,
    precoBalcao: 7.98, precoAtacado: 5.50, quantidadeEstoque: 15,
    diasValidadePadrao: 5,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.5 },
      { ingredienteId: '003', quantidade: 5 },
      { ingredienteId: '002', quantidade: 0.03 },
      { ingredienteId: '010', quantidade: 30 },
    ],
    textoReceita: 'Misture, amasse e coloque na forma. Asse por 30 minutos a 200°C.',
    image: null,
  },
  {
    id: '004', code: '042', name: 'Broche de Coco', codigoBarras: '7891234560004',
    percentualICMS: 7, percentualLucroBalcao: 130, percentualLucroAtacado: 75,
    precoBalcao: 14.23, precoAtacado: 10.00, quantidadeEstoque: 12,
    diasValidadePadrao: 3,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.4 },
      { ingredienteId: '008', quantidade: 100 },
      { ingredienteId: '002', quantidade: 0.1 },
      { ingredienteId: '007', quantidade: 2 },
    ],
    textoReceita: 'Misture os ingredientes, forme bolinhas e asse a 180°C por 25 minutos.',
    image: null,
  },
  {
    id: '005', code: '074', name: 'Broche Caseiro', codigoBarras: '7891234560005',
    percentualICMS: 7, percentualLucroBalcao: 128, percentualLucroAtacado: 72,
    precoBalcao: 7.98, precoAtacado: 5.80, quantidadeEstoque: 20,
    diasValidadePadrao: 3,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.3 },
      { ingredienteId: '009', quantidade: 80 },
      { ingredienteId: '002', quantidade: 0.05 },
    ],
    textoReceita: 'Misture, modele e asse a 170°C por 20 minutos.',
    image: null,
  },
  {
    id: '006', code: '020', name: 'Cacetinho', codigoBarras: '7891234560006',
    percentualICMS: 7, percentualLucroBalcao: 140, percentualLucroAtacado: 85,
    precoBalcao: 0.60, precoAtacado: 0.42, quantidadeEstoque: 30,
    diasValidadePadrao: 2,
    fichasTecnica: [
      { ingredienteId: '001', quantidade: 0.04 },
      { ingredienteId: '003', quantidade: 1.0 },
      { ingredienteId: '004', quantidade: 0.8 },
    ],
    textoReceita: 'Amasse bem e modele em formato de cacetinho. Asse a 220°C por 20 minutos.',
    image: null,
  },
]

export function getProductByCode(code) { return PRODUCTS.find(p => p.code === code) || null }
export function getProductById(id)     { return PRODUCTS.find(p => p.id   === id)   || null }
