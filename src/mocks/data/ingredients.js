export const INGREDIENTS = [
  { id: '020', code: '020', name: 'Farinha de Trigo 10Kg', price: 89.90, qty: 2, icms: 0, validity: '17/06/2026', products: ['Pão Forma', 'Pão Francês', 'Pão Caseiro', 'Broche de Coco', 'Broche Caseiro', 'Cacetinho', 'Cacetinho Francês'], image: null },
  { id: '024', code: '024', name: 'Açúcar 5Kg',            price: 14.90, qty: 6, icms: 0, validity: '01/12/2026', products: ['Pão Francês', 'Pão Forma', 'Broche de Coco'], image: null },
  { id: '002', code: '002', name: 'Fermento para Pão 5g',  price:  6.90, qty: 30, icms: 0, validity: '30/09/2026', products: ['Pão Francês', 'Pão Forma', 'Cacetinho'], image: null },
  { id: '005', code: '005', name: 'Sal 1Kg',               price:  3.50, qty: 10, icms: 0, validity: '01/01/2027', products: ['Pão Francês', 'Cacetinho'], image: null },
  { id: '008', code: '008', name: 'Margarina 500g',         price:  5.90, qty: 5,  icms: 0, validity: '15/08/2026', products: ['Pão Francês'], image: null },
]

export function getIngredientByCode(code) {
  return INGREDIENTS.find(i => i.code === code) || null
}
