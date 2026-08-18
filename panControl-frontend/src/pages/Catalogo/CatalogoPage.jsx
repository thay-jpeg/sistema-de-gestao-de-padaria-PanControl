import { useState, useRef, useMemo, useEffect } from 'react'
import Header from '@/components/layout/Header'
import ProductCard from '@/components/pdv/ProductCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { canAccess } from '@/config/permissions'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'
import api from '@/services/api'

const EMPTY = {
  code: '', name: '', codigoBarras: '', percentualICMS: 7,
  diasValidadePadrao: 3,
  percentualLucroBalcao: 100, percentualLucroAtacado: 60,
  precoBalcao: '', precoAtacado: '',
  quantidadeEstoque: 0, fichasTecnica: [], textoReceita: '', image: null,
}

export default function CatalogoPage() {
  const { user } = useAuth()
  const { ingredients, products, addProduct,
    updateProduct, deleteProduct,
    calcValidade, calcCusto, getValidadeIng } = useData()

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [isNew, setIsNew] = useState(false)
  const [ingFilter, setIngFilter] = useState('')
  const searchRef = useRef()
  const canEdit = canAccess(user.role, 'gerenciamento')

  // ── Dados filtrados ───────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return q ? products.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.includes(q)
    ) : products
  }, [search, products])

  const filteredIngs = useMemo(() => {
    const q = ingFilter.toLowerCase().trim()
    return q ? ingredients.filter(i =>
      i.name.toLowerCase().includes(q) || i.code.includes(q)
    ) : ingredients
  }, [ingFilter, ingredients])

  // ── Cálculos automáticos ─────────────────────────────────────────────────
  const custoCalc = useMemo(
    () => calcCusto(form.fichasTecnica || []),
    [form.fichasTecnica, calcCusto]
  )

  const validadeCalc = useMemo(
    () => calcValidade(form.fichasTecnica || [], form.diasValidadePadrao, null),
    [form.fichasTecnica, form.diasValidadePadrao, calcValidade]
  )

  // ── Abre modais ───────────────────────────────────────────────────────────
  function openProduct(product) {
    setSelected(product)
    setForm({ ...product, fichasTecnica: [...(product.fichasTecnica || [])] })
    setIsNew(false); setIngFilter(''); setModal(true)
  }
  function openNew() {
    setSelected(null); setForm({ ...EMPTY }); setIsNew(true); setIngFilter(''); setModal(true)
  }

  // ── FichaTécnica helpers ──────────────────────────────────────────────────
  function toggleIngrediente(ingId) {
    setForm(f => {
      const exists = (f.fichasTecnica || []).find(x => x.ingredienteId === ingId)
      if (exists) return { ...f, fichasTecnica: f.fichasTecnica.filter(x => x.ingredienteId !== ingId) }
      return { ...f, fichasTecnica: [...(f.fichasTecnica || []), { ingredienteId: ingId, quantidade: 1 }] }
    })
  }

  function setQtdFicha(ingId, qty) {
    setForm(f => ({
      ...f,
      fichasTecnica: (f.fichasTecnica || []).map(x =>
        x.ingredienteId === ingId ? { ...x, quantidade: parseFloat(qty) || 0 } : x
      ),
    }))
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  function saveProduct() {
    const payload = {
      ...form,
      percentualICMS: Number(form.percentualICMS),
      diasValidadePadrao: Number(form.diasValidadePadrao),
      percentualLucroBalcao: Number(form.percentualLucroBalcao),
      percentualLucroAtacado: Number(form.percentualLucroAtacado),
      precoBalcao: Number(form.precoBalcao),
      precoAtacado: Number(form.precoAtacado),
    }
    isNew ? addProduct(payload) : updateProduct(selected.id, payload)
    setModal(false)
  }

  function handleDelete() {
    if (!confirm('Excluir produto?')) return
    deleteProduct(selected.id)
    setModal(false)
  }

  useKeyboardShortcut([
    { key: 'F9', fn: () => modalOpen ? saveProduct() : null },
    { key: 'F10', fn: () => modalOpen && !isNew ? handleDelete() : null },
    { key: 'c', fn: () => !modalOpen && canEdit && openNew() },
    { key: 'C', fn: () => !modalOpen && canEdit && openNew() },
    { key: 'p', fn: () => !modalOpen && searchRef.current?.focus() },
    { key: 'P', fn: () => !modalOpen && searchRef.current?.focus() },
  ])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Catálogo" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex gap-3">
          <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
          <Button variant="gold">(P)rocurar</Button>
          {canEdit && <Button variant="green" onClick={openNew}>(C)adastrar +</Button>}
        </div>

        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto pan-scroll">
          <div className="flex flex-wrap gap-4">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={{ ...p, price: p.precoBalcao }} size="lg" onClick={openProduct} />
            ))}
            {filteredProducts.length === 0 && <p className="text-gray-400 text-sm">Nenhum produto encontrado.</p>}
          </div>
        </div>
      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[980px] max-h-[94vh] overflow-y-auto pan-scroll">
        <div className="p-6 flex flex-col gap-5">

          {/* Título */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-800">{isNew ? 'Novo Produto' : 'Editar Produto'}</h2>
            <div className="flex gap-2">
              <Button variant="green" shortcut="F9" onClick={saveProduct}>{isNew ? 'Cadastrar' : 'Salvar'}</Button>
              {!isNew && <Button variant="red" shortcut="F10" onClick={handleDelete}>Excluir</Button>}
            </div>
          </div>

          {/* Linha 1 — foto + campos básicos */}
          <div className="flex gap-5">
            <div className="w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg
                            flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:border-gold transition">
              {form.image
                ? <img src={form.image} className="w-full h-full object-cover" alt="" />
                : <span className="text-gray-400 text-xs text-center px-2">Foto do<br />produto</span>}
            </div>

            <div className="flex-1 grid grid-cols-4 gap-3">
              <FF label="Código" value={form.code} disabled className="col-span-1" />
              <FF label="Descrição" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} className="col-span-2" />
              <FF label="Cód. de Barras" value={form.codigoBarras} onChange={v => setForm(f => ({ ...f, codigoBarras: v }))} className="col-span-1" />
              <FF label="ICMS (%)" value={form.percentualICMS} onChange={v => setForm(f => ({ ...f, percentualICMS: v }))} type="number" />
              <FF label="Dias Validade" value={form.diasValidadePadrao} onChange={v => setForm(f => ({ ...f, diasValidadePadrao: v }))} type="number" />
              <FF label="Qtde Estoque" value={form.quantidadeEstoque} onChange={v => setForm(f => ({ ...f, quantidadeEstoque: v }))} type="number" />
              <div className="col-span-1" />
              <FF label="% Lucro Balcão" value={form.percentualLucroBalcao} onChange={v => setForm(f => ({ ...f, percentualLucroBalcao: v }))} type="number" />
              <FF label="Preço Balcão (R$)" value={form.precoBalcao} onChange={v => setForm(f => ({ ...f, precoBalcao: v }))} type="number" />
              <FF label="% Lucro Atacado" value={form.percentualLucroAtacado} onChange={v => setForm(f => ({ ...f, percentualLucroAtacado: v }))} type="number" />
              <FF label="Preço Atacado (R$)" value={form.precoAtacado} onChange={v => setForm(f => ({ ...f, precoAtacado: v }))} type="number" />
            </div>
          </div>

          {/* Linha 2 — ficha técnica + custos */}
          <div className="grid grid-cols-2 gap-5">

            {/* Esquerda: seletor de ingredientes */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">Ficha Técnica — Ingredientes:</p>
                <span className="text-xs text-gray-400">{(form.fichasTecnica || []).length} ingrediente(s)</span>
              </div>
              <input value={ingFilter} onChange={e => setIngFilter(e.target.value)}
                placeholder="Filtrar ingredientes..."
                className="bg-input-bg border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold" />

              {ingredients.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-sm text-amber-700">
                  Sem ingredientes cadastrados.<br />
                  <span className="text-xs">Vá em <b>Gerenciamento → Ingredientes</b></span>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-y-auto pan-scroll max-h-[240px] divide-y divide-gray-100">
                  {filteredIngs.map(ing => {
                    const fichaItem = (form.fichasTecnica || []).find(x => x.ingredienteId === ing.id)
                    const isSel = Boolean(fichaItem)
                    const validade = getValidadeIng(ing.id)
                    return (
                      <div key={ing.id}
                        className={`flex items-center gap-2 px-3 py-2 transition ${isSel ? 'bg-green/10 border-l-4 border-green' : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'}`}>
                        {/* checkbox */}
                        <button type="button" onClick={() => toggleIngrediente(ing.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                            ${isSel ? 'bg-green border-green' : 'border-gray-300'}`}>
                          {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        {/* info */}
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleIngrediente(ing.id)}>
                          <p className="text-xs font-semibold text-gray-800 truncate">{ing.name}</p>
                          <p className="text-[10px] text-gray-400">{ing.unidadeMedida} · cMed: R${(ing.custoMedioUnitario || 0).toFixed(3)}</p>
                        </div>
                        {/* validade badge */}
                        {validade && <ValidityBadge validity={validade} />}
                        {/* input de quantidade */}
                        {isSel && (
                          <input
                            type="number" min="0" step="any"
                            value={fichaItem.quantidade}
                            onChange={e => setQtdFicha(ing.id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="w-16 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold text-right"
                          />
                        )}
                        {isSel && <span className="text-[10px] text-gray-400 w-6">{ing.unidadeMedida}</span>}
                      </div>
                    )
                  })}
                  {filteredIngs.length === 0 && <p className="text-center text-gray-400 text-xs py-4">Nenhum ingrediente encontrado.</p>}
                </div>
              )}
            </div>

            {/* Direita: chips selecionados + custo + validade */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold text-sm mb-1">Ingredientes selecionados:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px] max-h-[120px] overflow-y-auto pan-scroll">
                  {(form.fichasTecnica || []).length === 0
                    ? <p className="text-gray-400 text-xs text-center mt-3">← Selecione ingredientes</p>
                    : <div className="flex flex-wrap gap-1.5">
                      {(form.fichasTecnica || []).map(f => {
                        const ing = ingredients.find(i => i.id === f.ingredienteId)
                        if (!ing) return null
                        return (
                          <span key={f.ingredienteId}
                            className="inline-flex items-center gap-1 bg-green/10 text-green border border-green/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                            {ing.name} <span className="text-gray-500 font-normal">({f.quantidade} {ing.unidadeMedida})</span>
                            <button onClick={() => toggleIngrediente(f.ingredienteId)} className="text-green/60 hover:text-red ml-0.5 font-bold">×</button>
                          </span>
                        )
                      })}
                    </div>
                  }
                </div>
              </div>

              {/* Custo de produção calculado */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">CUSTO DE PRODUÇÃO (calculado):</p>
                <p className="text-2xl font-bold text-red">R$ {custoCalc.toFixed(4)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Baseado no custo médio unitário de cada ingrediente.</p>
              </div>

              {/* Validade estimada */}
              <ValidityBanner validity={validadeCalc} dias={form.diasValidadePadrao} />
            </div>
          </div>

          {/* Linha 3 — receita */}
          <div>
            <p className="font-bold text-sm mb-1">Receita / Modo de Preparo <span className="text-xs text-gray-400 font-normal">(textoReceita — fichasTecnicas)</span>:</p>
            <textarea value={form.textoReceita || ''} onChange={e => setForm(f => ({ ...f, textoReceita: e.target.value }))}
              rows={4} placeholder="Descreva o modo de preparo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold resize-none pan-scroll" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function FF({ label, value, onChange, disabled, type = 'text', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)} disabled={disabled}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 w-full" />
    </div>
  )
}

function ValidityBadge({ validity }) {
  if (!validity) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [d, m, y] = validity.split('/')
  const diff = Math.round((new Date(Number(y), Number(m) - 1, Number(d)) - today) / 86400000)
  const cls = diff < 0 ? 'bg-red/10 text-red border-red/20'
    : diff <= 7 ? 'bg-amber-50 text-amber-600 border-amber-200'
      : 'bg-green/10 text-green border-green/20'
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${cls}`}>{validity}</span>
}

function ValidityBanner({ validity, dias }) {
  if (!validity && !dias) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [d, m, y] = (validity || '').split('/')
  const vDate = validity ? new Date(Number(y), Number(m) - 1, Number(d)) : null
  const diff = vDate ? Math.round((vDate - today) / 86400000) : null
  const isExp = diff !== null && diff < 0
  const isWarn = diff !== null && diff >= 0 && diff <= 7

  return (
    <div className={`rounded-lg px-4 py-2.5 text-xs font-semibold border flex items-start gap-2
      ${isExp ? 'bg-red/10 border-red/30 text-red' : isWarn ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-green/10 border-green/30 text-green'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div>
        <p>{validity ? `Validade estimada do lote: ${validity}` : `${dias} dias de validade padrão (selecione ingredientes para calcular)`}</p>
        {validity && <p className="opacity-70 mt-0.5">Determinada pelo menor prazo entre os {dias} dias padrão e os lotes de ingredientes.</p>}
      </div>
    </div>
  )
}
