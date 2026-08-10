import { useState, useRef, useEffect, useCallback } from 'react'
import Header        from '@/components/layout/Header'
import ProductCard   from '@/components/pdv/ProductCard'
import Modal         from '@/components/ui/Modal'
import Button        from '@/components/ui/Button'
import { PRODUCTS }  from '@/mocks/data/products'
import { useAuth }   from '@/context/AuthContext'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'

const PAYMENT_METHODS = [
  { num: 1, key: 'real',    label: 'REAL'     },
  { num: 2, key: 'pix',     label: 'PIX'      },
  { num: 3, key: 'credito', label: 'CRÉDITO'  },
  { num: 4, key: 'debito',  label: 'DÉBITO'   },
  { num: 5, key: 'atacado', label: 'ATACADO'  },
]

const PARCEL_OPTIONS = ['1x s/ juros', '2x s/ juros', '3x c/ juros', '6x c/ juros', '12x c/ juros']

export default function VendasPage() {
  const { user }          = useAuth()
  const [search,  setSearch]  = useState('')
  const [products, setProds]  = useState(PRODUCTS)
  const [cart,    setCart]    = useState([])
  const [client,  setClient]  = useState('')
  const [qty,     setQty]     = useState('')
  const [prodCode,setProdCode]= useState('')
  const [payOpen, setPayOpen] = useState(false)
  const [payStep, setPayStep] = useState(1)   // 1=metodos, 2=nota fiscal
  const [payMethods, setPayMethods] = useState({}) // { real: 10, pix: 24.44 }
  const [payInput, setPayInput]     = useState('')
  const [selMethod,setSelMethod]    = useState(null)
  const [parcels, setParcels]       = useState('1x s/ juros')
  const [nfStep,  setNfStep]        = useState(null) // 'nfe' | 'email'
  const [nfData,  setNfData]        = useState({ cpf: '', name: '', email: '' })
  const [discount, setDiscount]     = useState(0)

  const searchRef = useRef()

  const total = cart.reduce((s, i) => s + i.total, 0)
  const totalPago = Object.values(payMethods).reduce((s, v) => s + v, 0)
  const troco = Math.max(0, totalPago - (total * (1 - discount / 100)))

  // Filtro
  function handleSearch() {
    const q = search.toLowerCase().trim()
    setProds(q ? PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.includes(q)
    ) : PRODUCTS)
  }

  // Adicionar produto ao carrinho via código
  function addToCart(product, quantity = 1) {
    const q = parseInt(quantity) || 1
    setCart(prev => {
      const existing = prev.find(i => i.code === product.code)
      if (existing) {
        return prev.map(i => i.code === product.code
          ? { ...i, qty: i.qty + q, total: (i.qty + q) * i.price }
          : i
        )
      }
      return [...prev, { ...product, qty: q, total: q * product.price }]
    })
    setProdCode('')
    setQty('')
  }

  function removeFromCart(code) {
    setCart(prev => prev.filter(i => i.code !== code))
  }

  function cancelVenda() {
    setCart([])
    setClient('')
    setProdCode('')
    setQty('')
  }

  function finalizarVenda() {
    if (cart.length === 0) return
    setPayMethods({})
    setPayInput('')
    setSelMethod(null)
    setPayStep(1)
    setNfStep(null)
    setPayOpen(true)
  }

  function confirmPayment() {
    if (payStep === 1) { setPayStep(2); return }
    // Finaliza
    alert('Venda finalizada com sucesso!')
    setCart([])
    setClient('')
    setPayOpen(false)
  }

  function addPayMethod(key) {
    if (!payInput) return
    const val = parseFloat(payInput.replace(',', '.')) || 0
    setPayMethods(prev => ({ ...prev, [key]: (prev[key] || 0) + val }))
    setPayInput('')
    setSelMethod(key)
  }

  useKeyboardShortcut([
    { key: '/',     fn: cancelVenda },
    { key: 'F9',   fn: finalizarVenda },
    { key: 'p',    fn: () => searchRef.current?.focus(), allowInput: false },
    { key: 'P',    fn: () => searchRef.current?.focus(), allowInput: false },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Vendas" showBack />

      {/* Barra superior do PDV */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-end gap-4">
        <Field label="Cliente:" value={client} onChange={setClient} placeholder="Nome ou código..." className="w-44" />
        <Field label="Produto:" value={prodCode} onChange={setProdCode}
          placeholder="Cód do produto..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const p = PRODUCTS.find(p => p.code === prodCode.trim())
              if (p) addToCart(p, qty || 1)
            }
          }}
          className="w-52"
        />
        <Field label="Qtde:" value={qty} onChange={setQty} placeholder="1" className="w-20" type="number" />

        <Button variant="red" size="md" shortcut="/" onClick={cancelVenda} className="ml-auto min-w-[130px]">
          Cancelar
        </Button>
      </div>

      {/* Corpo do PDV */}
      <div className="flex-1 flex overflow-hidden">

        {/* Esquerda: carrinho */}
        <div className="w-[400px] flex flex-col border-r border-gray-200 bg-gray-50">
          {/* Cabeçalho do carrinho */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-sm">
              Vendedor: <span className="text-red font-bold">{user?.name}</span>
            </p>
          </div>
          <div className="grid grid-cols-4 text-xs font-bold text-gray-700 bg-brown text-white px-4 py-2">
            <span className="col-span-2">Descrição</span>
            <span className="text-center">Cód</span>
            <span className="text-right">Qtde</span>
          </div>
          <div className="flex-1 overflow-y-auto pan-scroll divide-y divide-gray-100">
            {cart.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Nenhum item adicionado.</p>
            )}
            {cart.map(item => (
              <div
                key={item.code}
                className="grid grid-cols-4 px-4 py-2.5 text-sm bg-yellow-50 items-center group"
              >
                <span className="col-span-2 font-bold truncate">{item.name}</span>
                <span className="text-center text-gray-600">{item.code}</span>
                <span className="text-right font-semibold">{item.qty}</span>
                {/* Total na linha abaixo */}
                <span className="col-span-3 text-xs text-gray-500 mt-0.5">
                  Total: R$ {item.total.toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={() => removeFromCart(item.code)}
                  className="text-right text-red text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Logo no rodapé do carrinho + Total */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-700">TOTAL:</span>
              <div className="bg-red text-white font-bold text-lg px-4 py-1.5 rounded">
                R$ {total.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        </div>

        {/* Direita: busca + grid de produtos */}
        <div className="flex-1 flex flex-col p-4 gap-4 bg-gray-50">
          {/* Busca */}
          <div className="flex gap-3">
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Digite o nome do produto que esteja buscando..."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Button variant="brown" onClick={handleSearch}>(P)rocurar</Button>
          </div>

          {/* Grid de produtos */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto pan-scroll">
            <div className="flex flex-wrap gap-3">
              {products.map(p => (
                <ProductCard
                  key={p.code}
                  product={p}
                  onClick={prod => addToCart(prod, qty || 1)}
                />
              ))}
            </div>
          </div>

          {/* Botão Finalizar */}
          <div className="flex justify-end">
            <Button
              variant="green"
              size="lg"
              shortcut="F9"
              onClick={finalizarVenda}
              disabled={cart.length === 0}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} className="w-[820px] max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Coluna esquerda: resumo financeiro */}
          <div className="w-72 border-r border-gray-200 p-6 flex flex-col gap-3">
            <Row label="VALOR TOTAL"  value={`R$ ${total.toFixed(2).replace('.', ',')}`} bold />
            <Row label="DESCONTO %"   value={discount > 0 ? `${discount}%` : '-'} />
            <Row label="VALOR PAGO"   value={`R$ ${totalPago.toFixed(2).replace('.', ',')}`} bold />

            {/* Métodos selecionados */}
            <div className="text-sm text-gray-600 space-y-0.5">
              {Object.entries(payMethods).map(([k, v]) => (
                <p key={k}><b className="uppercase">{k}</b> R$ {v.toFixed(2).replace('.', ',')}</p>
              ))}
            </div>

            <Row label="TROCO" value={`R$ ${troco.toFixed(2).replace('.', ',')}`} bold />
          </div>

          {/* Coluna direita: seleção de método ou nota fiscal */}
          <div className="flex-1 p-6">
            {payStep === 1 ? (
              <>
                {/* Métodos */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => { setSelMethod(m.key); setPayInput('') }}
                      className={[
                        'flex items-center gap-3 p-4 border rounded-lg text-left font-bold transition',
                        selMethod === m.key
                          ? 'border-gold bg-yellow-50'
                          : 'border-gray-200 hover:bg-gray-50',
                      ].join(' ')}
                    >
                      <span className="text-gray-400">{m.num}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Parcelas (só crédito) */}
                {selMethod === 'credito' && (
                  <div className="flex items-center gap-3 text-sm mb-4">
                    <span>Parcela(s) até</span>
                    <select
                      value={parcels}
                      onChange={e => setParcels(e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      {PARCEL_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}

                {/* Input de valor */}
                {selMethod && (
                  <div className="flex gap-3">
                    <input
                      value={payInput}
                      onChange={e => setPayInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addPayMethod(selMethod)}
                      placeholder="Valor..."
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gold focus:outline-none"
                    />
                    <Button onClick={() => addPayMethod(selMethod)}>Adicionar</Button>
                  </div>
                )}
              </>
            ) : (
              /* Step 2 – Nota Fiscal */
              <div>
                <p className="font-bold mb-4">NOTA FISCAL</p>
                <div className="flex gap-6 mb-4">
                  {['nfe','email'].map((n, i) => (
                    <button
                      key={n}
                      onClick={() => setNfStep(n)}
                      className={[
                        'font-bold text-sm px-3 py-1 rounded border transition',
                        nfStep === n ? 'bg-gold text-white border-gold' : 'border-gray-300 text-gray-700',
                      ].join(' ')}
                    >
                      ({i+1}) {n === 'nfe' ? 'NFE' : 'E-MAIL'}
                    </button>
                  ))}
                </div>
                {nfStep === 'email' && (
                  <div className="space-y-3">
                    <LabelInput label="CPF:"    value={nfData.cpf}   onChange={v => setNfData(d => ({...d, cpf:v}))} />
                    <LabelInput label="Nome:"   value={nfData.name}  onChange={v => setNfData(d => ({...d, name:v}))} />
                    <LabelInput label="E-mail:" value={nfData.email} onChange={v => setNfData(d => ({...d, email:v}))} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer modal */}
        <div className="flex justify-end px-6 pb-5">
          <Button variant="red" size="lg" shortcut="F9" onClick={confirmPayment}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', className = '', onKeyDown }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="font-bold text-sm text-gray-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold w-full"
      />
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center border border-gray-100 rounded p-2">
      <span className={`text-sm ${bold ? 'font-bold' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : ''}`}>{value}</span>
    </div>
  )
}

function LabelInput({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold w-16 text-right">{label}</span>
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-gold focus:outline-none"
      />
    </div>
  )
}
