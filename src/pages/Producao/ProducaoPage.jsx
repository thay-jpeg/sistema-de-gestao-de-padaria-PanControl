import { useState }      from 'react'
import Header             from '@/components/layout/Header'
import Button             from '@/components/ui/Button'
import DataTable          from '@/components/ui/DataTable'
import Modal              from '@/components/ui/Modal'
import logoFull           from '@/assets/images/logo-full.png'
import { PRODUCTS }       from '@/mocks/data/products'
import { INGREDIENTS }    from '@/mocks/data/ingredients'
import { PRODUCTIONS }    from '@/mocks/data/productions'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'

const STOCK_COLS = [
  { key: 'name',     label: 'Descrição' },
  { key: 'code',     label: 'Cód',    align: 'right' },
  { key: 'validity', label: 'Validade' },
  { key: 'priceStr', label: 'Preço',  align: 'right' },
  { key: 'qty',      label: 'Qtde',   align: 'right' },
]

const ING_COLS = [
  { key: 'name',     label: 'Descrição' },
  { key: 'code',     label: 'Cód',    align: 'right' },
  { key: 'priceStr', label: 'Preço',  align: 'right' },
  { key: 'qty',      label: 'Qtde',   align: 'right' },
]

export default function ProducaoPage() {
  const [prodSearch,  setProdSearch]  = useState('')
  const [ingSearch,   setIngSearch]   = useState('')
  const [prodCode,    setProdCode]    = useState('')
  const [selectedProd, setSelProd]    = useState(null)
  const [selectedIng,  setSelIng]     = useState(null)
  const [view,         setView]       = useState('stock') // 'stock' | 'ingredients'
  const [modalOpen,    setModal]      = useState(false)
  const [modalData,    setModalData]  = useState(null)

  // Dados das tabelas
  const stockRows = PRODUCTS
    .filter(p => !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()))
    .map(p => ({ ...p, priceStr: `R$${p.price.toFixed(2).replace('.', ',')}` }))

  const ingRows = INGREDIENTS
    .filter(i => !ingSearch || i.name.toLowerCase().includes(ingSearch.toLowerCase()))
    .map(i => ({ ...i, priceStr: `R$${i.price.toFixed(2).replace('.', ',')}` }))

  function openProducaoModal() {
    const newProd = { code: `0000011${PRODUCTIONS.length + 1}`, date: new Date().toLocaleDateString('pt-BR'), items: [], missing: [] }
    setModalData(newProd)
    setModal(true)
  }

  useKeyboardShortcut([
    { key: 'F9', fn: openProducaoModal },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Produção" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* Linha superior */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img src={logoFull} alt="PanControl+" className="h-24 object-contain" />

          {/* Campos */}
          <div className="flex flex-col gap-3 flex-1">
            <SearchRow
              label="Produções:"
              value={prodCode}
              onChange={setProdCode}
              onSearch={() => {}}
              placeholder="-"
              buttons={[
                <Button key="novo"   variant="green" onClick={openProducaoModal}>Novo+</Button>,
                <Button key="excluir" variant="red">Excluir</Button>,
              ]}
            />
            <SearchRow
              label="Estoque:"
              value={prodSearch}
              onChange={setProdSearch}
              onSearch={() => setView('stock')}
              placeholder="Todos"
              active={view === 'stock'}
              buttons={[<Button key="c" variant={view === 'stock' ? 'brown' : 'cream'} onClick={() => setView('stock')}>Consultar</Button>]}
            />
            <SearchRow
              label="Ingredientes:"
              value={ingSearch}
              onChange={setIngSearch}
              onSearch={() => setView('ingredients')}
              placeholder="Todos"
              active={view === 'ingredients'}
              buttons={[<Button key="c" variant={view === 'ingredients' ? 'brown' : 'cream'} onClick={() => setView('ingredients')}>Consultar</Button>]}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 flex flex-col gap-2">
          <p className="font-bold text-sm text-gray-800">
            {view === 'stock' ? 'Estoque disponível:' : 'Ingredientes disponíveis:'}
          </p>
          <div className="overflow-y-auto pan-scroll flex-1 max-h-[420px]">
            {view === 'stock' ? (
              <DataTable
                columns={STOCK_COLS}
                rows={stockRows}
                selectedId={selectedProd?.id}
                onSelect={setSelProd}
              />
            ) : (
              <DataTable
                columns={ING_COLS}
                rows={ingRows}
                selectedId={selectedIng?.id}
                onSelect={setSelIng}
              />
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end">
          {view === 'stock' && (
            <Button variant="gold" onClick={() => {}}>Alterar produto</Button>
          )}
          {view === 'ingredients' && (
            <Button variant="gold" onClick={() => {}}>Alterar ingrediente</Button>
          )}
        </div>
      </main>

      {/* Modal Nova Produção */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[700px]">
        <div className="p-6">
          {/* Cabeçalho do modal */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm whitespace-nowrap">Produções:</span>
              <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
                <span className="text-sm">{modalData?.code}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Data:</span>
              <div className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm">
                {modalData?.date}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <span className="font-bold text-sm whitespace-nowrap">Produtos:</span>
              <input
                placeholder="Código..."
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button variant="green">Adicionar</Button>
              <Button variant="red">Excluir</Button>
            </div>
          </div>

          {/* Tabela de itens da produção */}
          <div className="mb-4">
            <DataTable
              columns={[
                { key: 'name',  label: 'Descrição' },
                { key: 'code',  label: 'Cód',   align: 'right' },
                { key: 'price', label: 'Preço', align: 'right' },
                { key: 'qty',   label: 'Qtde',  align: 'right' },
              ]}
              rows={(modalData?.items || []).map(i => ({
                ...i,
                price: `R$${i.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              }))}
            />
          </div>

          {/* Tabela ingredientes faltando */}
          {(modalData?.missing || []).length > 0 && (
            <div className="mb-4">
              <DataTable
                columns={[
                  { key: 'name',    label: 'Descrição' },
                  { key: 'code',    label: 'Cód',     align: 'right' },
                  { key: 'stock',   label: 'Estoque', align: 'right' },
                  { key: 'missing', label: 'Faltam',  align: 'right' },
                ]}
                rows={modalData.missing}
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button variant="green" size="lg" onClick={() => { alert('Produção salva! (mock)'); setModal(false) }}>
              Salvar produção
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SearchRow({ label, value, onChange, onSearch, placeholder, buttons = [] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold w-28 text-right flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch?.()}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={onSearch}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {buttons.map((b, i) => <div key={i}>{b}</div>)}
    </div>
  )
}
