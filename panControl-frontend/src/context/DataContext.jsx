import { createContext, useContext, useState, useCallback } from 'react'
import { PRODUCTS }              from '@/mocks/data/products'
import { INGREDIENTS }           from '@/mocks/data/ingredients'
import { COMPRAS_INGREDIENTES }  from '@/mocks/data/comprasIngredientes'
import { PEDIDOS_VENDA }         from '@/mocks/data/pedidosVenda'
import { PERDAS_PRODUTOS }       from '@/mocks/data/perdasProdutos'
import { PRODUCTIONS }           from '@/mocks/data/productions'
import { CLIENTS }               from '@/mocks/data/clients'

const DataContext = createContext(null)

// ─── Helpers de data ─────────────────────────────────────────────────────────
export function parseBRDate(str) {
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return new Date(Number(y), Number(m) - 1, Number(d))
}
export function isoToBR(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
export function brToISO(br) {
  if (!br) return ''
  const [d, m, y] = br.split('/')
  if (!d || !m || !y) return ''
  return `${y}-${m}-${d}`
}
export function addDaysBR(brDate, days) {
  const d = parseBRDate(brDate)
  if (!d) return ''
  d.setDate(d.getDate() + days)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
export function todayBR() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

/**
 * Retorna a validade mais próxima entre os lotes de compra com estoque de um ingrediente.
 */
function getValidadeIngrediente(ingredienteId, compras) {
  const lotes = compras.filter(c => c.ingredienteId === ingredienteId && c.quantidadeRestante > 0)
  if (lotes.length === 0) return null
  const dates = lotes.map(c => parseBRDate(c.dataValidade)).filter(Boolean)
  if (dates.length === 0) return null
  const earliest = new Date(Math.min(...dates))
  return `${String(earliest.getDate()).padStart(2,'0')}/${String(earliest.getMonth()+1).padStart(2,'0')}/${earliest.getFullYear()}`
}

/**
 * Calcula dataValidadeLote de um produto:
 * min(dataProducao + diasValidadePadrao, min(validadeLote de cada ingrediente))
 */
export function calcDataValidadeLote(fichasTecnica, diasValidadePadrao, compras, dataProducao) {
  const base = dataProducao || todayBR()
  const dataByDias = addDaysBR(base, diasValidadePadrao || 0)
  const baseDateObj = parseBRDate(dataByDias)
  if (!baseDateObj) return dataByDias

  let earliest = baseDateObj
  fichasTecnica.forEach(({ ingredienteId }) => {
    const val = getValidadeIngrediente(ingredienteId, compras)
    if (val) {
      const d = parseBRDate(val)
      if (d && d < earliest) earliest = d
    }
  })
  return `${String(earliest.getDate()).padStart(2,'0')}/${String(earliest.getMonth()+1).padStart(2,'0')}/${earliest.getFullYear()}`
}

/**
 * Custo de produção de uma unidade: soma(quantidade * custoMedioUnitario)
 */
export function calcCustoProducao(fichasTecnica, ingredients) {
  return fichasTecnica.reduce((total, { ingredienteId, quantidade }) => {
    const ing = ingredients.find(i => i.id === ingredienteId)
    return total + (ing ? (ing.custoMedioUnitario * (quantidade || 0)) : 0)
  }, 0)
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [ingredients,  setIngredients]  = useState(INGREDIENTS)
  const [products,     setProducts]     = useState(PRODUCTS)
  const [compras,      setCompras]      = useState(COMPRAS_INGREDIENTES)
  const [pedidos,      setPedidos]      = useState(PEDIDOS_VENDA)
  const [perdas,       setPerdas]       = useState(PERDAS_PRODUTOS)
  const [producoes,    setProducoes]    = useState(PRODUCTIONS)
  const [clients,      setClients]      = useState(CLIENTS)

  // ── helpers expostos ──────────────────────────────────────────────────────
  const getValidadeIng = useCallback(
    (id) => getValidadeIngrediente(id, compras),
    [compras]
  )

  const calcValidade = useCallback(
    (fichasTecnica, diasValidadePadrao, dataProducao) =>
      calcDataValidadeLote(fichasTecnica, diasValidadePadrao, compras, dataProducao),
    [compras]
  )

  const calcCusto = useCallback(
    (fichasTecnica) => calcCustoProducao(fichasTecnica, ingredients),
    [ingredients]
  )

  // ── Ingredientes CRUD ─────────────────────────────────────────────────────
  const addIngredient = useCallback((data) => {
    const nextCode = String(Math.max(...ingredients.map(i => parseInt(i.code) || 0)) + 1).padStart(3,'0')
    const newIng = { ...data, id: nextCode, code: nextCode }
    setIngredients(prev => [...prev, newIng])
    return newIng
  }, [ingredients])

  const updateIngredient = useCallback((id, data) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))
  }, [])

  const deleteIngredient = useCallback((id) => {
    setIngredients(prev => prev.filter(i => i.id !== id))
    setProducts(prev => prev.map(p => ({
      ...p,
      fichasTecnica: (p.fichasTecnica || []).filter(f => f.ingredienteId !== id),
    })))
  }, [])

  // ── Compras de ingredientes CRUD ──────────────────────────────────────────
  const addCompra = useCallback((data) => {
    const nextId = `CI${String(compras.length + 1).padStart(3,'0')}`
    const cuUni  = data.custoTotal / data.quantidadeComprada
    const nova   = { ...data, id: nextId, quantidadeRestante: data.quantidadeComprada, custoUnitario: cuUni }
    setCompras(prev => [...prev, nova])
    // Atualiza custoMedioUnitario do ingrediente (média ponderada)
    setIngredients(prev => prev.map(i => {
      if (i.id !== data.ingredienteId) return i
      const qtdAnterior = i.quantidadeEstoque || 0
      const novaQtd     = qtdAnterior + data.quantidadeComprada
      const novoCusto   = novaQtd > 0
        ? (qtdAnterior * i.custoMedioUnitario + data.quantidadeComprada * cuUni) / novaQtd
        : cuUni
      return { ...i, quantidadeEstoque: novaQtd, custoMedioUnitario: novoCusto }
    }))
    return nova
  }, [compras])

  const deleteCompra = useCallback((id) => {
    setCompras(prev => prev.filter(c => c.id !== id))
  }, [])

  // ── Produtos CRUD ─────────────────────────────────────────────────────────
  const addProduct = useCallback((data) => {
    const nextCode = String(Math.max(...products.map(p => parseInt(p.code) || 0)) + 1).padStart(3,'0')
    const newProd  = { ...data, id: nextCode, code: nextCode }
    setProducts(prev => [...prev, newProd])
    return newProd
  }, [products])

  const updateProduct = useCallback((id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  // ── Produções CRUD ────────────────────────────────────────────────────────
  const addProducao = useCallback((data) => {
    const nextId = `PRD${String(producoes.length + 1).padStart(3,'0')}`
    const nova   = { ...data, id: nextId, code: nextId }
    setProducoes(prev => [...prev, nova])
    // Decrementa quantidadeEstoque do produto
    setProducts(prev => prev.map(p =>
      p.id === data.idProduto
        ? { ...p, quantidadeEstoque: (p.quantidadeEstoque || 0) + (data.quantidadeProduzida || 0) }
        : p
    ))
    return nova
  }, [producoes])

  // ── Perdas CRUD ───────────────────────────────────────────────────────────
  const addPerda = useCallback((data) => {
    const nextId = `PP${String(perdas.length + 1).padStart(3,'0')}`
    const nova   = { ...data, id: nextId }
    setPerdas(prev => [...prev, nova])
    setProducts(prev => prev.map(p =>
      p.id === data.idProduto
        ? { ...p, quantidadeEstoque: Math.max(0, (p.quantidadeEstoque || 0) - (data.quantidadePerdida || 0)) }
        : p
    ))
    return nova
  }, [perdas])

  // ── Pedidos de venda CRUD ─────────────────────────────────────────────────
  const addPedido = useCallback((data) => {
    const nextId = `PV${String(pedidos.length + 1).padStart(3,'0')}`
    const novo   = { ...data, id: nextId, situacao: data.situacao || 'rascunho', dataPedido: todayBR() }
    setPedidos(prev => [...prev, novo])
    return novo
  }, [pedidos])

  const updatePedidoSituacao = useCallback((id, situacao) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, situacao } : p))
  }, [])

  const deletePedido = useCallback((id) => {
    setPedidos(prev => prev.filter(p => p.id !== id))
  }, [])

  // ── Clientes CRUD ─────────────────────────────────────────────────────────
  const addClient = useCallback((data) => {
    setClients(prev => [...prev, data])
  }, [])

  const updateClient = useCallback((code, data) => {
    setClients(prev => prev.map(c => c.code === code ? { ...c, ...data } : c))
  }, [])

  const deleteClient = useCallback((code) => {
    setClients(prev => prev.filter(c => c.code !== code))
  }, [])

  return (
    <DataContext.Provider value={{
      // estado
      ingredients, products, compras, pedidos, perdas, producoes, clients,
      // helpers
      getValidadeIng, calcValidade, calcCusto,
      // ingredientes
      addIngredient, updateIngredient, deleteIngredient,
      // compras
      addCompra, deleteCompra,
      // produtos
      addProduct, updateProduct, deleteProduct,
      // produções
      addProducao,
      // perdas
      addPerda,
      // pedidos
      addPedido, updatePedidoSituacao, deletePedido,
      // clientes
      addClient, updateClient, deleteClient,
      // utils
      isoToBR, brToISO, parseBRDate, todayBR,
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
