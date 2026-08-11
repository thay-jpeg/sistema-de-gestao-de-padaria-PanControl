import { useState, useMemo } from 'react'
import Header                from '@/components/layout/Header'
import Button                from '@/components/ui/Button'
import DataTable             from '@/components/ui/DataTable'
import Modal                 from '@/components/ui/Modal'
import logoFull              from '@/assets/images/logo-full.png'
import { useData }           from '@/context/DataContext'
import { PRODUCTIONS }       from '@/mocks/data/productions'
import useKeyboardShortcut   from '@/hooks/useKeyboardShortcut'

const STOCK_COLS = [
  { key: 'name',     label: 'Descrição' },
  { key: 'code',     label: 'Cód',      align: 'right' },
  { key: 'validity', label: 'Validade'  },
  { key: 'priceStr', label: 'Preço',    align: 'right' },
  { key: 'qty',      label: 'Qtde',     align: 'right' },
]

const ING_COLS = [
  { key: 'name',     label: 'Descrição' },
  { key: 'code',     label: 'Cód',      align: 'right' },
  { key: 'priceStr', label: 'Preço',    align: 'right' },
  { key: 'qty',      label: 'Qtde',     align: 'right' },
  { key: 'validity', label: 'Validade'  },
]

export default function ProducaoPage() {
  const { products, ingredients } = useData()

  const [prodSearch, setProdSearch] = useState('')
  const [ingSearch,  setIngSearch]  = useState('')
  const [view,       setView]       = useState('stock')      // 'stock' | 'ingredients'
  const [selectedRow,setRow]        = useState(null)
  const [modalOpen,  setModal]      = useState(false)

  // Código sequencial para nova produção
  const nextProdCode = `0000011${PRODUCTIONS.length + 1}`

  // Dados das tabelas com filtro
  const stockRows = useMemo(() =>
    products
      .filter(p => !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.code.includes(prodSearch))
      .map(p => ({ ...p, priceStr: `R$${Number(p.price).toFixed(2).replace('.', ',')}` })),
    [products, prodSearch]
  )

  const ingRows = useMemo(() =>
    ingredients
      .filter(i => !ingSearch || i.name.toLowerCase().includes(ingSearch.toLowerCase()) || i.code.includes(ingSearch))
      .map(i => ({ ...i, priceStr: `R$${Number(i.price).toFixed(2).replace('.', ',')}` })),
    [ingredients, ingSearch]
  )

  // Modal de nova produção
  const [prodItems,  setProdItems]  = useState([])
  const [prodCode,   setProdCode]   = useState('')
  const [prodDate]                  = useState(new Date().toLocaleDateString('pt-BR'))
  const [addCode,    setAddCode]    = useState('')

  function openNovaProducao() {
    setProdItems([])
    setAddCode('')
    setProdCode(nextProdCode)
    setModal(true)
  }

  function addItemToProducao() {
    const prod = products.find(p => p.code === addCode.trim())
    if (!prod) { alert('Produto não encontrado.'); return }
    if (prodItems.find(i => i.code === prod.code)) { alert('Produto já adicionado.'); return }
    setProdItems(prev => [...prev, {
      ...prod,
      priceStr: `R$${Number(prod.price).toFixed(2).replace('.', ',')}`,
    }])
    setAddCode('')
  }

  function removeItemFromProducao(code) {
    setProdItems(prev => prev.filter(i => i.code !== code))
  }

  function saveProducao() {
    if (prodItems.length === 0) { alert('Adicione ao menos um produto.'); return }
    alert(`Produção ${prodCode} salva com ${prodItems.length} produto(s)! (mock)`)
    setModal(false)
  }

  // Ingredientes que faltam para a produção atual
  const missingIngredients = useMemo(() => {
    if (prodItems.length === 0) return []
    const needed = {}
    prodItems.forEach(prod => {
      (prod.ingredientIds || []).forEach(id => {
        needed[id] = (needed[id] || 0) + 1
      })
    })
    return Object.entries(needed)
      .map(([id, need]) => {
        const ing = ingredients.find(i => i.id === id)
        if (!ing) return null
        const faltam = Math.max(0, need - ing.qty)
        return faltam > 0 ? { ...ing, stock: ing.qty, missing: faltam } : null
      })
      .filter(Boolean)
  }, [prodItems, ingredients])

  useKeyboardShortcut([
    { key: 'F9',   fn: () => modalOpen ? saveProducao() : openNovaProducao() },
    { key: 'Enter',fn: () => modalOpen && addCode && addItemToProducao(), allowInput: true },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Produção" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* ── Linha de controles ─────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <img src={logoFull} alt="PanControl+" className="h-24 object-contain flex-shrink-0" />

          <div className="flex flex-col gap-3 flex-1">
            {/* Produções */}
            <SearchRow
              label="Produções:"
              value=""
              onChange={() => {}}
              placeholder="-"
              buttons={[
                <Button key="novo"    variant="green" onClick={openNovaProducao}>Novo+</Button>,
                <Button key="excluir" variant="red">Excluir</Button>,
              ]}
            />

            {/* Estoque */}
            <SearchRow
              label="Estoque:"
              value={view === 'stock' ? prodSearch : ''}
              onChange={v => { setView('stock'); setProdSearch(v) }}
              placeholder="Todos"
              buttons={[
                <Button
                  key="c"
                  variant={view === 'stock' ? 'brown' : 'cream'}
                  onClick={() => setView('stock')}
                >
                  Consultar
                </Button>,
              ]}
            />

            {/* Ingredientes */}
            <SearchRow
              label="Ingredientes:"
              value={view === 'ingredients' ? ingSearch : ''}
              onChange={v => { setView('ingredients'); setIngSearch(v) }}
              placeholder="Todos"
              buttons={[
                <Button
                  key="c"
                  variant={view === 'ingredients' ? 'brown' : 'cream'}
                  onClick={() => setView('ingredients')}
                >
                  Consultar
                </Button>,
              ]}
            />
          </div>
        </div>

        {/* ── Tabela ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="font-bold text-sm text-gray-800">
            {view === 'stock' ? 'Estoque disponível:' : 'Ingredientes disponíveis:'}
          </p>
          <div className="overflow-y-auto pan-scroll max-h-[420px] flex-1">
            <DataTable
              columns={view === 'stock' ? STOCK_COLS : ING_COLS}
              rows={view === 'stock' ? stockRows : ingRows}
              selectedId={selectedRow?.id}
              onSelect={setRow}
            />
          </div>
        </div>

        {/* Botão contextual */}
        <div className="flex justify-end">
          {selectedRow && (
            <Button variant="gold" onClick={() => alert('Abrir edição — disponível com API.')}>
              {view === 'stock' ? 'Alterar produto' : 'Alterar ingrediente'}
            </Button>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          Modal Nova Produção
      ══════════════════════════════════════════════════════════════ */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[720px] max-h-[90vh] overflow-y-auto pan-scroll">
        <div className="p-6 flex flex-col gap-4">

          {/* Cabeçalho */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm whitespace-nowrap">Produções:</span>
              <div className="flex-1 flex items-center bg-input-bg border border-gray-200 rounded px-3 py-2 gap-2">
                <span className="text-sm font-mono">{prodCode}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Data:</span>
              <div className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm">{prodDate}</div>
            </div>
          </div>

          {/* Linha de adicionar produto */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm whitespace-nowrap">Produtos:</span>
            <input
              value={addCode}
              onChange={e => setAddCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItemToProducao()}
              placeholder="Código do produto..."
              className="flex-1 bg-input-bg border-2 border-gold rounded px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Button variant="green" onClick={addItemToProducao}>Adicionar</Button>
            <Button variant="red"   onClick={() => selectedRow && removeItemFromProducao(selectedRow.code)}>Excluir</Button>
          </div>

          {/* Tabela de produtos na produção */}
          <div>
            <p className="font-bold text-sm text-gray-700 mb-1">Produtos desta produção:</p>
            <DataTable
              columns={[
                { key: 'name',     label: 'Descrição' },
                { key: 'code',     label: 'Cód',   align: 'right' },
                { key: 'priceStr', label: 'Preço', align: 'right' },
                { key: 'qty',      label: 'Qtde',  align: 'right' },
              ]}
              rows={prodItems}
              selectedId={selectedRow?.id}
              onSelect={setRow}
            />
          </div>

          {/* Tabela de ingredientes faltando */}
          {missingIngredients.length > 0 && (
            <div>
              <p className="font-bold text-sm text-red mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Ingredientes insuficientes em estoque:
              </p>
              <DataTable
                columns={[
                  { key: 'name',    label: 'Ingrediente' },
                  { key: 'code',    label: 'Cód',     align: 'right' },
                  { key: 'stock',   label: 'Estoque', align: 'right' },
                  { key: 'missing', label: 'Faltam',  align: 'right' },
                ]}
                rows={missingIngredients}
              />
            </div>
          )}

          {/* Botão salvar */}
          <div className="flex justify-end">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveProducao}>
              Salvar produção
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── SearchRow reutilizável ───────────────────────────────────────────────────
function SearchRow({ label, value, onChange, placeholder, buttons = [] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold w-28 text-right flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {buttons.map((b, i) => <div key={i}>{b}</div>)}
    </div>
  )
}
