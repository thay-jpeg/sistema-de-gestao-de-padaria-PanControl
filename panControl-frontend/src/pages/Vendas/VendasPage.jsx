import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/pdv/ProductCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/config/permissions';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';



const PAYMENT_METHODS = [
  { num: 1, key: 'real', label: 'REAL' },
  { num: 2, key: 'pix', label: 'PIX' },
  { num: 3, key: 'credito', label: 'CRÉDITO' },
  { num: 4, key: 'debito', label: 'DÉBITO' },
  { num: 5, key: 'atacado', label: 'ATACADO' },
];
const PARCEL_OPTIONS = ['1x s/ juros', '2x s/ juros', '3x c/ juros', '6x c/ juros', '12x c/ juros'];

export default function VendasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGestor = canAccess(user?.role, 'pedidosVenda');

  const [modo, setModo] = useState('balcao');
  const [dbClients, setDbClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // PDV States
  const [search, setSearch] = useState('');
  const [filteredP, setFilteredP] = useState([]);
  const [cart, setCart] = useState([]);
  const [client, setClient] = useState('');
  const [qty, setQty] = useState('');
  const [prodCode, setProdCode] = useState('');
  const searchRef = useRef(null);

  // Pagamento States
  const [payOpen, setPayOpen] = useState(false);
  const [payStep, setPayStep] = useState(1);
  const [payMethods, setPayMethods] = useState({});
  const [payInput, setPayInput] = useState('');
  const [selMethod, setSelMethod] = useState(null);
  const [parcelas, setParcelas] = useState('1x s/ juros');
  const [nfData, setNfData] = useState({ cpf: '', email: '' });
  const [discount, setDiscount] = useState(0);
  
  // Pedido States
  const [pedidoOpen, setPedidoOpen] = useState(false);
  const [pedidoClient, setPedidoClient] = useState('');

  // Busca inicial de clientes
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch('http://localhost:8080/api/clientes');
        if (response.ok) setDbClients(await response.json());
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  // Busca real de produtos no SGBD
  async function handleSearch() {
    if (!search.trim()) return;
    try {
      const response = await fetch(`http://localhost:8080/api/produtos/buscar?q=${search}`);
      if (response.ok) setFilteredP(await response.json());
    } catch (error) {
      console.error("Erro ao buscar produtos no SGBD", error);
    }
  }

  // Cálculos
  const getPrice = useCallback((p) => modo === 'atacado' ? (p.precoAtacado || p.precoBalcao || 0) : (p.precoBalcao || 0), [modo]);
  const total = useMemo(() => cart.reduce((s, i) => s + i.total, 0), [cart]);
  const totalPago = useMemo(() => Object.values(payMethods).reduce((s, v) => s + v, 0), [payMethods]);
  const troco = useMemo(() => Math.max(0, totalPago - total * (1 - discount / 100)), [totalPago, total, discount]);

  function addToCart(product, quantity = 1) {
    const q = parseInt(quantity) || 1;
    const price = getPrice(product);
    setCart(prev => {
      const ex = prev.find(i => i.idProduto_PK === product.idProduto_PK);
      if (ex) return prev.map(i => i.idProduto_PK === product.idProduto_PK ? { ...i, qty: i.qty + q, total: (i.qty + q) * price } : i);
      return [...prev, { ...product, qty: q, price, total: q * price }];
    });
    setProdCode(''); setQty('');
  }

  function removeFromCart(id) { setCart(prev => prev.filter(i => i.idProduto_PK !== id)); }
  function cancelVenda() { setCart([]); setClient(''); setProdCode(''); setQty(''); }

  function finalizarVenda() {
    if (cart.length === 0) return;
    setPayMethods({}); setPayInput(''); setSelMethod(null); setPayStep(1); setNfData({ cpf: '', email: '' });
    setPayOpen(true);
  }

  async function confirmPayment() {
    if (payStep === 1) { setPayStep(2); return; }
    setIsLoading(true);

    const metodoPrincipal = Object.keys(payMethods)[0] || 'PIX';
    const cli = dbClients.find(c => c.nomeRazaoSocial.toLowerCase() === client.toLowerCase() || c.documentoCliente === client);

    const payload = {
      metodoPagamento: metodoPrincipal.toUpperCase(),
      idUsuario: user?.idUsuario || user?.id || 1,
      idClienteAtacadista: cli ? cli.idClienteAtacadista_PK : null, // Removido o _FK
      nfeCpf: nfData.cpf || null,
      nfeEmail: nfData.email || null,
      desconto: discount,
      itens: cart.map(item => ({
        idProduto: item.idProduto || item.idProduto_PK || item.id || 1, 
        quantidade: item.qty || 1
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Venda registrada no SGBD com sucesso!');
        cancelVenda();
        setPayOpen(false);
      } else {
        alert('Erro ao processar a venda.');
      }
    } catch (error) {
      alert('Falha de comunicação.');
    } finally {
      setIsLoading(false);
    }
  }

  function criarPedido() {
    if (cart.length === 0) { alert('Adicione produtos ao carrinho.'); return; }
    setPedidoClient(''); setPedidoOpen(true);
  }

  async function savePedido() {
    if (!pedidoClient) { alert('Selecione um cliente atacadista.'); return; }
    setIsLoading(true);

    const payload = {
      idUsuario: 1, // Removido o _FK
      idClienteAtacadista: parseInt(pedidoClient), // Removido o _FK
      itens: cart.map(item => ({
        idProduto: item.idProduto_PK || item.id, // Removido o _FK
        quantidade: item.qty
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Pedido salvo e itens abatidos do estoque com sucesso!');
        setPedidoOpen(false);
        cancelVenda();
      } else {
        alert('Erro ao registrar pedido.');
      }
    } catch (error) {
      alert('Falha na conexão.');
    } finally {
      setIsLoading(false);
    }
  }

  function addPayMethod(key) {
    if (!payInput) return;
    const val = parseFloat(payInput.replace(',', '.')) || 0;
    setPayMethods(prev => ({ ...prev, [key]: (prev[key] || 0) + val }));
    setPayInput(''); setSelMethod(key);
  }

  useKeyboardShortcut([
    { key: '/', fn: cancelVenda },
    { key: 'F9', fn: finalizarVenda },
    { key: 'p', fn: () => searchRef.current?.focus() },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      
      {/* Overlay transparente obrigatório durante requests */}
      {isLoading && (
        <div className="absolute inset-0 bg-transparent z-50 flex items-center justify-center pointer-events-none">
          <p className="text-yellow-400 font-bold text-2xl drop-shadow-md">Processando no SGBD...</p>
        </div>
      )}

      <Header title="Vendas" showBack />
      
      {/* Barra PDV */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-end gap-3 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button onClick={() => setModo('balcao')} className={`px-4 py-2 text-sm font-bold ${modo === 'balcao' ? 'bg-green text-white' : 'bg-white'}`}>Balcão</button>
          <button onClick={() => setModo('atacado')} className={`px-4 py-2 text-sm font-bold ${modo === 'atacado' ? 'bg-gold text-white' : 'bg-white'}`}>Atacado</button>
        </div>

        <Field label="Cliente SGBD:" value={client} onChange={setClient} placeholder="Razão ou Doc..." className="w-44" />
        <Field label="Busca de Produto:" value={search} onChange={setSearch} placeholder="Nome..." onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-44" />
        <Button variant="brown" onClick={handleSearch}>(P)rocurar</Button>

        <div className="ml-auto flex gap-2">
          <Button variant="gold" onClick={criarPedido}>Criar Pedido</Button>
          {isGestor && <Button variant="brown" onClick={() => navigate('/pedidos-venda')}>Gerenciar Pedidos</Button>}
          <Button variant="red" onClick={cancelVenda} className="min-w-[120px]">Cancelar</Button>
        </div>
      </div>

      {/* Corpo PDV */}
      <div className="flex-1 flex overflow-hidden">
        {/* Carrinho */}
        <div className="w-[400px] flex flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex-1 overflow-y-auto pan-scroll divide-y divide-gray-100">
            {cart.map(item => (
              <div key={item.idProduto_PK} className="grid grid-cols-4 px-4 py-2 text-sm bg-yellow-50 items-center group">
                <span className="col-span-2 font-bold truncate text-xs">{item.nomeProduto}</span>
                <span className="text-center text-gray-600 text-xs">{item.codigoBarras}</span>
                <span className="text-right font-semibold text-xs">{item.qty}</span>
                <button onClick={() => removeFromCart(item.idProduto_PK)} className="text-right text-red text-xs opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-sm">TOTAL:</span>
            <div className="bg-red text-white font-bold text-lg px-4 py-1.5 rounded">R$ {total.toFixed(2)}</div>
          </div>
        </div>

        {/* Grid de Produtos via API */}
        <div className="flex-1 flex flex-col p-4 gap-4 bg-gray-50">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto pan-scroll">
            <div className="flex flex-wrap gap-3">
              {filteredP.length === 0 ? (
                <p className="text-gray-400 text-sm">Faça uma busca para carregar do banco de dados.</p>
              ) : (
                filteredP.map(p => (
                  <ProductCard key={p.idProduto_PK} product={{ ...p, price: getPrice(p) }} onClick={prod => addToCart(prod, qty || 1)} />
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="green" size="lg" onClick={finalizarVenda} disabled={cart.length === 0}>Finalizar Venda Direta</Button>
          </div>
        </div>
      </div>

      {/* Modal Pagamento e NFe */}
      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} className="w-[820px]">
        <div className="flex">
          {/* Lado esquerdo - Resumo */}
          <div className="w-72 border-r border-gray-200 p-6 flex flex-col gap-3">
            <Row label="TOTAL" value={`R$ ${total.toFixed(2)}`} bold />
            <Row label="PAGO" value={`R$ ${totalPago.toFixed(2)}`} bold />
            <Row label="TROCO" value={`R$ ${troco.toFixed(2)}`} bold />
          </div>

          <div className="flex-1 p-6">
            {payStep === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.key} onClick={() => { setSelMethod(m.key); setPayInput(''); }}
                      className={`p-4 border rounded-lg text-left font-bold ${selMethod === m.key ? 'border-gold bg-yellow-50' : 'border-gray-200'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
                {selMethod && (
                  <div className="flex gap-3">
                    <input value={payInput} onChange={e => setPayInput(e.target.value)} placeholder="Valor..." className="flex-1 border border-gray-300 rounded px-3 py-2" />
                    <Button onClick={() => addPayMethod(selMethod)}>Adicionar Pagamento</Button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="font-bold mb-4">DADOS PARA NOTA FISCAL (Opcional)</p>
                <div className="space-y-3 mb-6">
                  <input placeholder="CPF na Nota" value={nfData.cpf} onChange={e => setNfData(d => ({ ...d, cpf: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                  <input placeholder="E-mail para envio" value={nfData.email} onChange={e => setNfData(d => ({ ...d, email: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end px-6 pb-5">
          <Button variant="red" size="lg" onClick={confirmPayment}>{payStep === 1 ? 'Avançar para NFe' : 'Confirmar Venda SGBD'}</Button>
        </div>
      </Modal>

      {/* Modal Criar Pedido */}
      <Modal isOpen={pedidoOpen} onClose={() => setPedidoOpen(false)} className="w-[580px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Criar Pedido de Venda Atacado</h2>
          <select value={pedidoClient} onChange={e => setPedidoClient(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-4">
            <option value="">Selecione o Cliente no Banco...</option>
            {dbClients.map(c => <option key={c.idClienteAtacadista_PK} value={c.idClienteAtacadista_PK}>{c.nomeRazaoSocial}</option>)}
          </select>
          <div className="flex justify-end">
            <Button variant="green" onClick={savePedido}>Salvar e Abater Estoque</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', className = '', onKeyDown }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="font-bold text-xs text-gray-700 uppercase">{label}</label>
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} className="border border-gray-200 rounded px-3 py-2 text-sm w-full" />
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center border border-gray-100 rounded p-2">
      <span className={`text-sm ${bold ? 'font-bold' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : ''}`}>{value}</span>
    </div>
  );
}