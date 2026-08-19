import { useState, useRef, useMemo, useCallback } from 'react'
import { useNavigate }    from 'react-router-dom'
import Header             from '@/components/layout/Header'
import ProductCard        from '@/components/pdv/ProductCard'
import Modal              from '@/components/ui/Modal'
import Button             from '@/components/ui/Button'
import { useAuth }        from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { canAccess }      from '@/config/permissions'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'

const PAYMENT_METHODS = [
  { num:1, key:'real',    label:'REAL'    },
  { num:2, key:'pix',     label:'PIX'     },
  { num:3, key:'credito', label:'CRÉDITO' },
  { num:4, key:'debito',  label:'DÉBITO'  },
  { num:5, key:'atacado', label:'ATACADO' },
]
const PARCEL_OPTIONS = ['1x s/ juros','2x s/ juros','3x c/ juros','6x c/ juros','12x c/ juros']
const SITUACOES_LABEL = { rascunho:'Rascunho', confirmado:'Confirmado', entregue:'Entregue', cancelado:'Cancelado' }

export default function VendasPage() {
  const { user }                       = useAuth()
  const { products, clients, addPedido,
          pedidos, updatePedidoSituacao } = useData()
  const navigate                        = useNavigate()
  const isGestor = canAccess(user.role, 'pedidosVenda')

  // ── Modo balcão / atacado ─────────────────────────────────────────────────
  const [modo,   setModo]   = useState('balcao') // 'balcao' | 'atacado'

  // ── PDV state ─────────────────────────────────────────────────────────────
  const [search,   setSearch]   = useState('')
  const [filteredP,setFiltered] = useState(products)
  const [cart,     setCart]     = useState([])
  const [client,   setClient]   = useState('')
  const [qty,      setQty]      = useState('')
  const [prodCode, setProdCode] = useState('')
  const searchRef = useRef()

  // ── Modal pagamento ───────────────────────────────────────────────────────
  const [payOpen,    setPayOpen]    = useState(false)
  const [payStep,    setPayStep]    = useState(1)
  const [payMethods, setPayMethods] = useState({})
  const [payInput,   setPayInput]   = useState('')
  const [selMethod,  setSelMethod]  = useState(null)
  const [parcelas,   setParcelas]   = useState('1x s/ juros')
  const [nfStep,     setNfStep]     = useState(null)
  const [nfData,     setNfData]     = useState({ cpf:'', name:'', email:'' })
  const [discount,   setDiscount]   = useState(0)

  // ── Modal pedido atacado ──────────────────────────────────────────────────
  const [pedidoOpen,    setPedidoOpen]    = useState(false)
  const [pedidoClient,  setPedidoClient]  = useState('')
  const [pedidoSituacao,setPedidoSituacao]= useState('confirmado')

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const getPrice  = useCallback((p) => modo==='atacado' ? (p.precoAtacado||p.precoBalcao||0) : (p.precoBalcao||0), [modo])
  const total     = useMemo(() => cart.reduce((s,i)=>s+i.total,0), [cart])
  const totalPago = useMemo(() => Object.values(payMethods).reduce((s,v)=>s+v,0), [payMethods])
  const troco     = useMemo(() => Math.max(0, totalPago - total*(1-discount/100)), [totalPago, total, discount])

  function handleSearch() {
    const q = search.toLowerCase().trim()
    setFiltered(q ? products.filter(p=>p.name.toLowerCase().includes(q)||p.code.includes(q)) : products)
  }

  function addToCart(product, quantity=1) {
    const q = parseInt(quantity)||1
    const price = getPrice(product)
    setCart(prev=>{
      const ex = prev.find(i=>i.id===product.id)
      if (ex) return prev.map(i=>i.id===product.id?{...i,qty:i.qty+q,total:(i.qty+q)*price}:i)
      return [...prev, { ...product, qty:q, price, total:q*price }]
    })
    setProdCode(''); setQty('')
  }

  function removeFromCart(id) { setCart(prev=>prev.filter(i=>i.id!==id)) }
  function cancelVenda()      { setCart([]); setClient(''); setProdCode(''); setQty('') }

  function finalizarVenda() {
    if (cart.length===0) return
    setPayMethods({}); setPayInput(''); setSelMethod(null); setPayStep(1); setNfStep(null)
    setPayOpen(true)
  }

  async function confirmPayment() {
    if (payStep === 1) { 
      setPayStep(2); 
      return; 
    }

    // Pega o primeiro método de pagamento usado na tela
    const metodoPrincipal = Object.keys(payMethods)[0] || 'PIX';
    
    // Tenta encontrar o ID do cliente caso o usuário tenha digitado o nome ou código
    const cli = clients.find(c => c.code === client || c.name.toLowerCase() === client.toLowerCase());

    // Monta o JSON (Payload)
    const payload = {
      metodoPagamento: metodoPrincipal.toUpperCase(),
      idUsuario: user?.id || 1, // Usa o ID do vendedor logado
      idClienteAtacadista: cli ? cli.id : null, 
      itens: cart.map(item => ({
        idProduto: item.id,
        quantidade: item.qty
      }))
    };

    try {
      // Dispara para a porta padrão do Spring Boot
      const response = await fetch('http://localhost:8080/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Venda registrada com sucesso no banco de dados!');
        
        // Limpa a tela para a próxima venda
        setCart([]); 
        setClient(''); 
        setPayOpen(false);
        setPayMethods({});
        setPayInput('');
        setSelMethod(null);
        setPayStep(1);
      } else {
        alert('Erro ao processar a venda. Verifique o console do back-end.');
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert('Falha de comunicação. O servidor Java está ligado?');
    }
  }

  function addPayMethod(key) {
    if (!payInput) return
    const val = parseFloat(payInput.replace(',','.')) || 0
    setPayMethods(prev=>({...prev,[key]:(prev[key]||0)+val}))
    setPayInput(''); setSelMethod(key)
  }

  // ── Criar Pedido Atacado ──────────────────────────────────────────────────
  function criarPedido() {
    if (cart.length===0) { alert('Adicione produtos ao carrinho primeiro.'); return }
    setPedidoClient('')
    setPedidoSituacao('confirmado')
    setPedidoOpen(true)
  }

  function savePedido() {
    const cli = clients.find(c=>c.code===pedidoClient||c.name.toLowerCase()===pedidoClient.toLowerCase())
    const valorTotal = cart.reduce((s,i)=>s+(i.qty*(i.precoAtacado||i.precoBalcao||0)),0)
    addPedido({
      idClienteAtacadista: cli?.code || pedidoClient,
      nomeCliente: cli?.name || pedidoClient,
      valorTotal,
      situacao: pedidoSituacao,
      itens: cart.map(i=>({
        idProduto: i.id,
        nomeProduto: i.name,
        quantidade: i.qty,
        precoUnitarioAplicado: i.precoAtacado||i.precoBalcao||0,
      })),
      idUsuario: user.id,
    })
    alert(`Pedido ${pedidoSituacao==='confirmado'?'confirmado':'salvo como rascunho'}!`)
    setPedidoOpen(false); setCart([]); setClient('')
  }

  useKeyboardShortcut([
    { key:'/',  fn: cancelVenda },
    { key:'F9', fn: finalizarVenda },
    { key:'p',  fn: ()=>searchRef.current?.focus() },
    { key:'P',  fn: ()=>searchRef.current?.focus() },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Vendas" showBack />

      {/* ── Barra superior PDV ───────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-end gap-3 flex-wrap">
        {/* Modo Balcão / Atacado */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <button onClick={()=>setModo('balcao')}
            className={`px-4 py-2 text-sm font-bold transition ${modo==='balcao'?'bg-green text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
            Balcão
          </button>
          <button onClick={()=>setModo('atacado')}
            className={`px-4 py-2 text-sm font-bold transition ${modo==='atacado'?'bg-gold text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
            Atacado
          </button>
        </div>

        <Field label="Cliente:" value={client} onChange={setClient} placeholder="Nome ou código..." className="w-44" />
        <Field label="Produto:" value={prodCode} onChange={setProdCode} placeholder="Cód..."
          onKeyDown={e=>{ if(e.key==='Enter'){ const p=products.find(x=>x.code===prodCode.trim()); if(p) addToCart(p,qty||1) }}}
          className="w-44" />
        <Field label="Qtde:" value={qty} onChange={setQty} placeholder="1" type="number" className="w-20" />

        <div className="ml-auto flex gap-2">
          {/* Botão criar pedido */}
          <Button variant="gold" onClick={criarPedido}>Criar Pedido</Button>
          {/* Acesso direto à tela de pedidos (Gestor) */}
          {isGestor && (
            <Button variant="brown" onClick={()=>navigate('/pedidos-venda')}>
              Ver Pedidos {pedidos.filter(p=>p.situacao==='confirmado').length > 0 &&
                <span className="ml-1 bg-red text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {pedidos.filter(p=>p.situacao==='confirmado').length}
                </span>
              }
            </Button>
          )}
          <Button variant="red" shortcut="/" onClick={cancelVenda} className="min-w-[120px]">Cancelar</Button>
        </div>
      </div>

      {/* ── Corpo PDV ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Carrinho */}
        <div className="w-[400px] flex flex-col border-r border-gray-200 bg-gray-50">
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <p className="text-sm">Vendedor: <span className="text-red font-bold">{user?.name}</span></p>
            {modo==='atacado' && (
              <span className="text-xs bg-gold/20 text-gold-dark border border-gold/30 rounded-full px-2 py-0.5 font-bold">Atacado</span>
            )}
          </div>
          <div className="grid grid-cols-4 text-xs font-bold text-white bg-brown px-4 py-2">
            <span className="col-span-2">Descrição</span><span className="text-center">Cód</span><span className="text-right">Qtde</span>
          </div>
          <div className="flex-1 overflow-y-auto pan-scroll divide-y divide-gray-100">
            {cart.length===0 && <p className="text-center text-gray-400 text-sm py-8">Nenhum item.</p>}
            {cart.map(item=>(
              <div key={item.id} className="grid grid-cols-4 px-4 py-2 text-sm bg-yellow-50 items-center group">
                <span className="col-span-2 font-bold truncate text-xs">{item.name}</span>
                <span className="text-center text-gray-600 text-xs">{item.code}</span>
                <span className="text-right font-semibold text-xs">{item.qty}</span>
                <span className="col-span-3 text-[10px] text-gray-500 mt-0.5">
                  R$ {item.price.toFixed(2)} × {item.qty} = R$ {item.total.toFixed(2).replace('.',',')}
                </span>
                <button onClick={()=>removeFromCart(item.id)}
                  className="text-right text-red text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">TOTAL:</span>
              <div className="bg-red text-white font-bold text-lg px-4 py-1.5 rounded">
                R$ {total.toFixed(2).replace('.',',')}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de produtos */}
        <div className="flex-1 flex flex-col p-4 gap-4 bg-gray-50">
          <div className="flex gap-3">
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSearch()}
              placeholder="Digite o nome do produto que esteja buscando..."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            <Button variant="brown" onClick={handleSearch}>(P)rocurar</Button>
          </div>

          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto pan-scroll">
            <div className="flex flex-wrap gap-3">
              {filteredP.map(p=>(
                <ProductCard key={p.id}
                  product={{ ...p, price: getPrice(p) }}
                  onClick={prod=>addToCart(prod, qty||1)} />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="green" size="lg" shortcut="F9" onClick={finalizarVenda} disabled={cart.length===0}>
              Finalizar
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modal Pagamento ───────────────────────────────────────────────── */}
      <Modal isOpen={payOpen} onClose={()=>setPayOpen(false)} className="w-[820px]">
        <div className="flex">
          <div className="w-72 border-r border-gray-200 p-6 flex flex-col gap-3">
            <Row label="VALOR TOTAL"  value={`R$ ${total.toFixed(2).replace('.',',')}`} bold />
            <Row label="DESCONTO %"   value={discount>0?`${discount}%`:'-'} />
            <Row label="VALOR PAGO"   value={`R$ ${totalPago.toFixed(2).replace('.',',')}`} bold />
            <div className="text-xs text-gray-600 space-y-0.5">
              {Object.entries(payMethods).map(([k,v])=>(
                <p key={k}><b className="uppercase">{k}</b> R$ {v.toFixed(2).replace('.',',')}</p>
              ))}
            </div>
            <Row label="TROCO" value={`R$ ${troco.toFixed(2).replace('.',',')}`} bold />
          </div>

          <div className="flex-1 p-6">
            {payStep===1 ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PAYMENT_METHODS.map(m=>(
                    <button key={m.key} onClick={()=>{setSelMethod(m.key);setPayInput('')}}
                      className={`flex items-center gap-3 p-4 border rounded-lg text-left font-bold transition
                        ${selMethod===m.key?'border-gold bg-yellow-50':'border-gray-200 hover:bg-gray-50'}`}>
                      <span className="text-gray-400">{m.num}</span><span>{m.label}</span>
                    </button>
                  ))}
                </div>
                {selMethod==='credito' && (
                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span>Parcelas:</span>
                    <select value={parcelas} onChange={e=>setParcelas(e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-sm">
                      {PARCEL_OPTIONS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                {selMethod && (
                  <div className="flex gap-3">
                    <input value={payInput} onChange={e=>setPayInput(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&addPayMethod(selMethod)}
                      placeholder="Valor..."
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
                    <Button onClick={()=>addPayMethod(selMethod)}>Adicionar</Button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="font-bold mb-4">NOTA FISCAL</p>
                <div className="flex gap-4 mb-4">
                  {['nfe','email'].map((n,i)=>(
                    <button key={n} onClick={()=>setNfStep(n)}
                      className={`font-bold text-sm px-3 py-1 rounded border transition
                        ${nfStep===n?'bg-gold text-white border-gold':'border-gray-300 text-gray-700'}`}>
                      ({i+1}) {n==='nfe'?'NFE':'E-MAIL'}
                    </button>
                  ))}
                </div>
                {nfStep==='email' && (
                  <div className="space-y-3">
                    {[['CPF:','cpf'],['Nome:','name'],['E-mail:','email']].map(([lbl,fld])=>(
                      <div key={fld} className="flex items-center gap-3">
                        <span className="text-sm font-semibold w-16 text-right">{lbl}</span>
                        <input value={nfData[fld]} onChange={e=>setNfData(d=>({...d,[fld]:e.target.value}))}
                          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end px-6 pb-5">
          <Button variant="red" size="lg" shortcut="F9" onClick={confirmPayment}>Confirmar</Button>
        </div>
      </Modal>

      {/* ── Modal Criar Pedido Atacado ────────────────────────────────────── */}
      <Modal isOpen={pedidoOpen} onClose={()=>setPedidoOpen(false)} className="w-[580px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-1">Criar Pedido de Venda Atacado</h2>
          <p className="text-sm text-gray-500 mb-4">{cart.length} produto(s) · Total atacado: <b>R$ {cart.reduce((s,i)=>s+i.qty*(i.precoAtacado||i.precoBalcao||0),0).toFixed(2).replace('.',',')}</b></p>

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Cliente:</label>
              <select value={pedidoClient} onChange={e=>setPedidoClient(e.target.value)}
                className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="">Selecione o cliente...</option>
                {clients.map(c=><option key={c.code} value={c.code}>{c.name} ({c.cpf})</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Situação:</label>
              <div className="flex gap-2">
                {['rascunho','confirmado'].map(s=>(
                  <button key={s} onClick={()=>setPedidoSituacao(s)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg border transition
                      ${pedidoSituacao===s?'bg-header text-white border-header':'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                    {SITUACOES_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo itens */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-44 overflow-y-auto pan-scroll mb-4">
            {cart.map(i=>(
              <div key={i.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="font-semibold truncate flex-1">{i.name}</span>
                <span className="text-gray-500 mx-3">{i.qty}×</span>
                <span className="font-bold text-green">R$ {(i.precoAtacado||i.precoBalcao||0).toFixed(2).replace('.',',')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" onClick={savePedido}>Salvar Pedido</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type='text', className='', onKeyDown }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="font-bold text-xs text-gray-700 uppercase">{label}</label>
      <input type={type} value={value} onChange={e=>onChange?.(e.target.value)} onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold w-full" />
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center border border-gray-100 rounded p-2">
      <span className={`text-sm ${bold?'font-bold':'text-gray-500'}`}>{label}</span>
      <span className={`text-sm ${bold?'font-bold':''}`}>{value}</span>
    </div>
  )
}
