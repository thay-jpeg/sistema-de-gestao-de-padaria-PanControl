import { createContext, useContext, useState } from 'react'
import { PRODUCTS }     from '@/mocks/data/products'
import { INGREDIENTS }  from '@/mocks/data/ingredients'

// ─── Helpers de data ──────────────────────────────────────────────────────────
// Converte "DD/MM/YYYY" → Date
export function parseBRDate(str) {
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return new Date(Number(y), Number(m) - 1, Number(d))
}

// Converte "YYYY-MM-DD" (input type=date) → "DD/MM/YYYY"
export function isoToBR(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Converte "DD/MM/YYYY" → "YYYY-MM-DD"
export function brToISO(br) {
  if (!br) return ''
  const [d, m, y] = br.split('/')
  return `${y}-${m}-${d}`
}

/**
 * Dado um array de ingredientIds (códigos) e a lista completa de ingredientes,
 * retorna a data de validade mais curta entre eles, formatada em "DD/MM/YYYY".
 * Retorna '' se nenhum ingrediente tiver validade.
 */
export function calcProductValidity(ingredientCodes, allIngredients) {
  const dates = ingredientCodes
    .map(code => allIngredients.find(i => i.id === code))
    .filter(Boolean)
    .map(i => parseBRDate(i.validity))
    .filter(Boolean)

  if (dates.length === 0) return ''
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
  const d = String(earliest.getDate()).padStart(2, '0')
  const m = String(earliest.getMonth() + 1).padStart(2, '0')
  const y = earliest.getFullYear()
  return `${d}/${m}/${y}`
}

// ─── Context ──────────────────────────────────────────────────────────────────
const DataContext = createContext(null)

// Normaliza os produtos do mock: ingredients agora são arrays de IDs (codes)
function normalizeProducts(rawProducts, allIngredients) {
  return rawProducts.map(p => {
    // Se já for array de IDs cadastrados, mantém. Senão, tenta casar pelo nome.
    const ingIds = (p.ingredients || []).map(nameOrId => {
      const found = allIngredients.find(
        i => i.id === nameOrId || i.name.toLowerCase().includes(nameOrId.toLowerCase())
      )
      return found ? found.id : null
    }).filter(Boolean)
    return { ...p, ingredientIds: ingIds }
  })
}

export function DataProvider({ children }) {
  const [ingredients, setIngredients] = useState(INGREDIENTS)
  const [products,    setProducts]    = useState(() => normalizeProducts(PRODUCTS, INGREDIENTS))

  // ── Ingredientes CRUD ───────────────────────────────────────────────────────
  function addIngredient(data) {
    const nextCode = String(Math.max(...ingredients.map(i => parseInt(i.code) || 0)) + 1).padStart(3, '0')
    const newIng = { ...data, id: nextCode, code: nextCode, products: [] }
    setIngredients(prev => [...prev, newIng])
    return newIng
  }

  function updateIngredient(id, data) {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))
  }

  function deleteIngredient(id) {
    setIngredients(prev => prev.filter(i => i.id !== id))
    // Remove das listas de produtos
    setProducts(prev => prev.map(p => ({
      ...p,
      ingredientIds: p.ingredientIds.filter(iid => iid !== id),
    })))
  }

  // ── Produtos CRUD ───────────────────────────────────────────────────────────
  function addProduct(data) {
    const nextCode = String(Math.max(...products.map(p => parseInt(p.code) || 0)) + 1).padStart(3, '0')
    const validity = calcProductValidity(data.ingredientIds || [], ingredients)
    const newProd  = { ...data, id: nextCode, code: nextCode, validity }
    setProducts(prev => [...prev, newProd])
    return newProd
  }

  function updateProduct(id, data) {
    const validity = calcProductValidity(data.ingredientIds || [], ingredients)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data, validity } : p))
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <DataContext.Provider value={{
      ingredients, addIngredient, updateIngredient, deleteIngredient,
      products,    addProduct,    updateProduct,    deleteProduct,
      calcProductValidity: (ids) => calcProductValidity(ids, ingredients),
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider')
  return ctx
}
