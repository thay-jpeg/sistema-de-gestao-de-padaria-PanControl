// Todos os campos de validade estão no formato DD/MM/YYYY
export const INGREDIENTS = [
  {
    id: '001', code: '001', name: 'Farinha de Trigo 10Kg',
    price: 89.90, qty: 2, icms: 0,
    validity: '17/08/2026',
    products: ['Pão Francês', 'Pão Forma', 'Pão Caseiro', 'Broche de Coco', 'Broche Caseiro', 'Cacetinho', 'Cacetinho Francês'],
    image: null,
  },
  {
    id: '002', code: '002', name: 'Açúcar Cristal 5Kg',
    price: 14.90, qty: 6, icms: 0,
    validity: '01/12/2026',
    products: ['Pão Francês', 'Pão Forma', 'Broche de Coco'],
    image: null,
  },
  {
    id: '003', code: '003', name: 'Fermento Biológico Seco 5g',
    price: 6.90, qty: 30, icms: 0,
    validity: '30/09/2026',
    products: ['Pão Francês', 'Pão Forma', 'Cacetinho'],
    image: null,
  },
  {
    id: '004', code: '004', name: 'Sal Refinado 1Kg',
    price: 3.50, qty: 10, icms: 0,
    validity: '01/01/2027',
    products: ['Pão Francês', 'Cacetinho'],
    image: null,
  },
  {
    id: '005', code: '005', name: 'Margarina 500g',
    price: 5.90, qty: 5, icms: 0,
    validity: '15/08/2026',
    products: ['Pão Francês'],
    image: null,
  },
  {
    id: '006', code: '006', name: 'Leite Integral 1L',
    price: 4.90, qty: 12, icms: 0,
    validity: '20/08/2026',
    products: ['Pão Caseiro'],
    image: null,
  },
  {
    id: '007', code: '007', name: 'Ovos (dúzia)',
    price: 12.90, qty: 4, icms: 0,
    validity: '10/08/2026',
    products: ['Pão Caseiro', 'Broche de Coco'],
    image: null,
  },
  {
    id: '008', code: '008', name: 'Coco Ralado 200g',
    price: 8.50, qty: 8, icms: 0,
    validity: '27/11/2026',
    products: ['Broche de Coco'],
    image: null,
  },
  {
    id: '009', code: '009', name: 'Manteiga sem Sal 500g',
    price: 18.90, qty: 3, icms: 0,
    validity: '25/09/2026',
    products: ['Broche Caseiro', 'Pão Caseiro'],
    image: null,
  },
  {
    id: '010', code: '010', name: 'Óleo de Soja 900ml',
    price: 6.90, qty: 7, icms: 0,
    validity: '22/01/2027',
    products: ['Pão Forma'],
    image: null,
  },
]

export function getIngredientByCode(code) {
  return INGREDIENTS.find(i => i.code === code) || null
}
