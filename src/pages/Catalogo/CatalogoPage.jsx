import { useState, useRef, useMemo } from 'react'
import Header              from '@/components/layout/Header'
import ProductCard         from '@/components/pdv/ProductCard'
import Button              from '@/components/ui/Button'
import Modal               from '@/components/ui/Modal'
import { useAuth }         from '@/context/AuthContext'
import { useData }         from '@/context/DataContext'
import { canAccess }       from '@/config/permissions'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'

const EMPTY_PRODUCT = {
  code: '', name: '', price: '', cost: '', icms: '', qty: '',
  validity: '', ingredientIds: [], recipe: '', image: null,
}

export default function CatalogoPage() {
  const { user }                                             = useAuth()
  const { ingredients, products, addProduct, updateProduct, deleteProduct, calcProductValidity } = useData()

  const [search,    setSearch]   = useState('')
  const [selected,  setSelected] = useState(null)
  const [modalOpen, setModal]    = useState(false)
  const [formData,  setForm]     = useState(EMPTY_PRODUCT)
  const [isNew,     setIsNew]    = useState(false)
  const [ingSearch, setIngSearch]= useState('')

  const searchRef = useRef()
  const canEdit   = canAccess(user.role, 'gerenciamento')

  // Produtos filtrados pela busca
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return q
      ? products.filter(p => p.name.toLowerCase().includes(q) || p.code.includes(q))
      : products
  }, [search, products])

  // Ingredientes cadastrados filtrados pela busca interna do modal
  const filteredIngredients = useMemo(() => {
    const q = ingSearch.toLowerCase().trim()
    return q
      ? ingredients.filter(i => i.name.toLowerCase().includes(q) || i.code.includes(q))
      : ingredients
  }, [ingSearch, ingredients])

  // Ingredientes selecionados no form (objetos completos)
  const selectedIngredients = useMemo(() =>
    (formData.ingredientIds || [])
      .map(id => ingredients.find(i => i.id === id))
      .filter(Boolean),
    [formData.ingredientIds, ingredients]
  )

  // Validade calculada automaticamente
  const calculatedValidity = useMemo(() =>
    calcProductValidity(formData.ingredientIds || []),
    [formData.ingredientIds, calcProductValidity]
  )

  function openProduct(product) {
    setSelected(product)
    setForm({ ...product, ingredientIds: [...(product.ingredientIds || [])] })
    setIsNew(false)
    setIngSearch('')
    setModal(true)
  }

  function openNew() {
    setSelected(null)
    setForm({ ...EMPTY_PRODUCT })
    setIsNew(true)
    setIngSearch('')
    setModal(true)
  }

  function toggleIngredient(ingId) {
    setForm(f => {
      const ids = f.ingredientIds || []
      const next = ids.includes(ingId)
        ? ids.filter(id => id !== ingId)
        : [...ids, ingId]
      return { ...f, ingredientIds: next }
    })
  }

  function saveProduct() {
    const payload = { ...formData, validity: calculatedValidity || formData.validity }
    if (isNew) {
      addProduct(payload)
    } else {
      updateProduct(selected.id, payload)
    }
    setModal(false)
  }

  function handleDelete() {
    if (!confirm('Deseja excluir este produto?')) return
    deleteProduct(selected.id)
    setModal(false)
  }

  useKeyboardShortcut([
    { key: 'F9',  fn: () => modalOpen ? saveProduct() : null },
    { key: 'F10', fn: () => modalOpen && !isNew ? handleDelete() : null },
    { key: 'c',   fn: () => !modalOpen && canEdit && openNew() },
    { key: 'C',   fn: () => !modalOpen && canEdit && openNew() },
    { key: 'p',   fn: () => !modalOpen && searchRef.current?.focus() },
    { key: 'P',   fn: () => !modalOpen && searchRef.current?.focus() },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Catálogo" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* Barra de busca */}
        <div className="flex gap-3">
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Digite o nome do produto que esteja buscando..."
            className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button variant="gold"  onClick={() => {}}>(P)rocurar</Button>
          {canEdit && (
            <Button variant="green" onClick={openNew}>(C)adastrar +</Button>
          )}
        </div>

        {/* Grid de produtos */}
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto pan-scroll">
          <div className="flex flex-wrap gap-4">
            {filteredProducts.map(p => (
              <ProductCard key={p.code} product={p} size="lg" onClick={openProduct} />
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum produto encontrado.</p>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal de cadastro/edição ─────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[940px] max-h-[92vh] overflow-y-auto pan-scroll">
        <div className="p-6 flex flex-col gap-5">

          {/* ── Linha 1: foto + campos básicos + botões ── */}
          <div className="flex gap-5">
            {/* Foto */}
            <div className="w-40 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300
                            flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer
                            hover:border-gold transition">
              {formData.image
                ? <img src={formData.image} className="w-full h-full object-cover" alt="" />
                : <span className="text-gray-400 text-xs text-center px-2">Clique para<br/>adicionar foto</span>
              }
            </div>

            {/* Campos */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              <FF label="Código"     value={formData.code}    onChange={v => setForm(f => ({...f, code: v}))}    disabled />
              <FF label="Descrição"  value={formData.name}    onChange={v => setForm(f => ({...f, name: v}))}    className="col-span-2" />
              <FF label="ICMS (%)"   value={formData.icms}    onChange={v => setForm(f => ({...f, icms: v}))}    />
              <FF label="Qtde"       value={formData.qty}     onChange={v => setForm(f => ({...f, qty: v}))}     />
              <FF label="Preço Venda (R$)" value={formData.price} onChange={v => setForm(f => ({...f, price: v}))} />
              <FF label="Custo Prod. (R$)" value={formData.cost}  onChange={v => setForm(f => ({...f, cost: v}))} />
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-2 min-w-[100px]">
              <Button variant="green" onClick={saveProduct}>Salvar</Button>
              {!isNew && <Button variant="red" onClick={handleDelete}>Excluir</Button>}
            </div>
          </div>

          {/* ── Validade calculada ── */}
          <ValidityBanner validity={calculatedValidity} count={selectedIngredients.length} />

          {/* ── Linha 2: seletor de ingredientes (esq) + custos (dir) ── */}
          <div className="grid grid-cols-2 gap-5">

            {/* Seletor de ingredientes */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-gray-800">Ingredientes cadastrados:</p>
                <span className="text-xs text-gray-400">{selectedIngredients.length} selecionado(s)</span>
              </div>

              {/* Busca interna */}
              <input
                value={ingSearch}
                onChange={e => setIngSearch(e.target.value)}
                placeholder="Filtrar ingredientes..."
                className="bg-input-bg border border-gray-200 rounded px-3 py-1.5 text-xs
                           focus:outline-none focus:ring-2 focus:ring-gold w-full"
              />

              {/* Grid clicável de ingredientes */}
              {ingredients.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-sm text-amber-700">
                  Nenhum ingrediente cadastrado ainda.<br/>
                  <span className="text-xs">Acesse <b>Gerenciamento → Ingredientes</b> para cadastrar.</span>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-y-auto pan-scroll max-h-[220px] divide-y divide-gray-100">
                  {filteredIngredients.map(ing => {
                    const selected = (formData.ingredientIds || []).includes(ing.id)
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => toggleIngredient(ing.id)}
                        className={[
                          'w-full flex items-center gap-3 px-3 py-2.5 text-left transition',
                          selected
                            ? 'bg-green/10 border-l-4 border-green'
                            : 'bg-white hover:bg-gray-50 border-l-4 border-transparent',
                        ].join(' ')}
                      >
                        {/* Checkbox visual */}
                        <div className={[
                          'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                          selected ? 'bg-green border-green' : 'border-gray-300',
                        ].join(' ')}>
                          {selected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Info do ingrediente */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{ing.name}</p>
                          <p className="text-xs text-gray-400">
                            Cód: {ing.code} · Val: {ing.validity} · R$ {ing.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>

                        {/* Badge validade */}
                        <ValidityBadge validity={ing.validity} />
                      </button>
                    )
                  })}
                  {filteredIngredients.length === 0 && (
                    <p className="text-center text-gray-400 text-xs py-4">Nenhum ingrediente encontrado.</p>
                  )}
                </div>
              )}
            </div>

            {/* Lista selecionados + custos */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold text-sm text-gray-800 mb-2">Ingredientes do produto:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[80px] max-h-[130px] overflow-y-auto pan-scroll">
                  {selectedIngredients.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center mt-4">
                      Selecione ingredientes ao lado ←
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIngredients.map(ing => (
                        <span
                          key={ing.id}
                          className="inline-flex items-center gap-1 bg-green/10 text-green border border-green/30
                                     rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {ing.name}
                          <button
                            onClick={() => toggleIngredient(ing.id)}
                            className="text-green/60 hover:text-red ml-0.5 font-bold"
                          >×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="font-bold text-sm mb-1">CUSTO PRODUÇÃO:</p>
                <div className="border border-gray-200 rounded-lg p-3 text-red font-bold text-xl">
                  R$ {parseFloat(formData.cost || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mb-1">PREÇO VENDA:</p>
                <div className="border border-gray-200 rounded-lg p-3 text-green font-bold text-xl">
                  R$ {parseFloat(formData.price || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Button variant="green" size="lg" shortcut="F9"  onClick={saveProduct}>
                  {isNew ? 'Cadastrar' : 'Salvar'}
                </Button>
                {!isNew && (
                  <Button variant="red" size="lg" shortcut="F10" onClick={handleDelete}>
                    Excluir produto
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Receita ── */}
          <div>
            <p className="font-bold mb-1 text-sm">Receita:</p>
            <textarea
              value={formData.recipe || ''}
              onChange={e => setForm(f => ({...f, recipe: e.target.value}))}
              rows={4}
              placeholder="Descreva o modo de preparo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-gold resize-none pan-scroll"
            />
          </div>

        </div>
      </Modal>
    </div>
  )
}

// ─── Componentes internos ─────────────────────────────────────────────────────

function FF({ label, value, onChange, disabled, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600">{label}</label>}
      <input
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 w-full"
      />
    </div>
  )
}

function ValidityBanner({ validity, count }) {
  if (count === 0) return null

  const today    = new Date(); today.setHours(0,0,0,0)
  const [d,m,y]  = (validity || '').split('/')
  const vDate    = validity ? new Date(Number(y), Number(m)-1, Number(d)) : null
  const diffDays = vDate ? Math.round((vDate - today) / 86400000) : null

  const isExpired = diffDays !== null && diffDays < 0
  const isWarning = diffDays !== null && diffDays >= 0 && diffDays <= 7

  return (
    <div className={[
      'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold border',
      isExpired ? 'bg-red/10 border-red/30 text-red'
        : isWarning ? 'bg-amber-50 border-amber-300 text-amber-700'
        : 'bg-green/10 border-green/30 text-green',
    ].join(' ')}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>
        {isExpired
          ? `⚠ Validade vencida! O ingrediente mais curto venceu em ${validity}.`
          : isWarning
          ? `⚠ Validade próxima: ${validity} — restam ${diffDays} dia(s). (Determinada pelo ingrediente mais curto)`
          : `Validade calculada: ${validity} — determinada pelo ingrediente de menor prazo.`
        }
      </span>
    </div>
  )
}

function ValidityBadge({ validity }) {
  if (!validity) return null
  const today   = new Date(); today.setHours(0,0,0,0)
  const [d,m,y] = validity.split('/')
  const vDate   = new Date(Number(y), Number(m)-1, Number(d))
  const diff    = Math.round((vDate - today) / 86400000)

  const cls = diff < 0    ? 'bg-red/10 text-red border-red/20'
            : diff <= 7   ? 'bg-amber-50 text-amber-600 border-amber-200'
            : diff <= 30  ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
            : 'bg-green/10 text-green border-green/20'

  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${cls}`}>
      {validity}
    </span>
  )
}
