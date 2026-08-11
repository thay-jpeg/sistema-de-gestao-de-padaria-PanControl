// ingredientIds referencia os IDs de ingredients.js
// validity será recalculada automaticamente pelo DataContext
export const PRODUCTS = [
  {
    id: '110', code: '110', name: 'Pão Francês',
    price: 1.50, cost: 0.60, icms: 7, qty: 10,
    validity: '15/08/2026',
    ingredientIds: ['001', '002', '003', '004', '005'],
    recipe: 'Modo de preparo: 2h 30min\nDilua o fermento em um copo de água morna com o açúcar.\nMisture os outros ingredientes.\nAmasse e levante, empurrando a massa para frente com a palma da mão, dobrando-a sobre si mesma.',
    image: null,
  },
  {
    id: '092', code: '092', name: 'Pão Caseiro',
    price: 19.90, cost: 8.00, icms: 7, qty: 8,
    validity: '10/08/2026',
    ingredientIds: ['001', '006', '007', '009'],
    recipe: 'Misture todos os ingredientes e asse a 180°C por 40 minutos.',
    image: null,
  },
  {
    id: '115', code: '115', name: 'Pão Forma',
    price: 7.98, cost: 3.20, icms: 7, qty: 15,
    validity: '17/08/2026',
    ingredientIds: ['001', '003', '002', '010'],
    recipe: 'Misture, amasse e coloque na forma. Asse por 30 minutos a 200°C.',
    image: null,
  },
  {
    id: '042', code: '042', name: 'Broche de Coco',
    price: 14.23, cost: 6.00, icms: 7, qty: 12,
    validity: '10/08/2026',
    ingredientIds: ['001', '008', '002', '007'],
    recipe: 'Misture os ingredientes, forme bolinhas e asse a 180°C por 25 minutos.',
    image: null,
  },
  {
    id: '074', code: '074', name: 'Broche Caseiro',
    price: 7.98, cost: 3.50, icms: 7, qty: 20,
    validity: '17/08/2026',
    ingredientIds: ['001', '009', '002'],
    recipe: 'Misture, modele e asse a 170°C por 20 minutos.',
    image: null,
  },
  {
    id: '020', code: '020', name: 'Cacetinho',
    price: 9.98, cost: 4.00, icms: 7, qty: 30,
    validity: '15/08/2026',
    ingredientIds: ['001', '003', '004'],
    recipe: 'Amasse bem e modele em formato de cacetinho. Asse a 220°C por 20 minutos.',
    image: null,
  },
  {
    id: '050', code: '050', name: 'Cacetinho Francês',
    price: 12.98, cost: 5.50, icms: 7, qty: 25,
    validity: '15/08/2026',
    ingredientIds: ['001', '003', '004'],
    recipe: 'Massa mais hidratada. Asse a 240°C com vapor por 25 minutos.',
    image: null,
  },
]

export function getProductByCode(code) {
  return PRODUCTS.find(p => p.code === code) || null
}
