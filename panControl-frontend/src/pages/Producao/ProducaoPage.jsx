import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import logoFull from '@/assets/images/logo-full.png'
import { useData, brToISO, isoToBR, todayBR } from '@/context/DataContext'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'
import api from '@/services/api'

const STOCK_COLS = [
  { key: 'name', label: 'Descrição' },
  { key: 'code', label: 'Cód', align: 'right' },
  { key: 'validity', label: 'Val.Lote' },
  { key: 'precoStr', label: 'Preço Balcão', align: 'right' },
  { key: 'qtdeStr', label: 'Qtde', align: 'right' },
]
const ING_COLS = [
  { key: 'name', label: 'Descrição' },
  { key: 'code', label: 'Cód', align: 'right' },
  { key: 'custoStr', label: 'Custo Médio', align: 'right' },
  { key: 'qtdeStr', label: 'Estoque', align: 'right' },
  { key: 'validade', label: 'Val. Lote' },
  { key: 'estoqueStatus', label: 'Status' },
]
const PROD_COLS = [
  { key: 'code', label: 'Cód.' },
  { key: 'nomeProduto', label: 'Produto' },
  { key: 'quantidadeProduzida', label: 'Qtde', align: 'right' },
  { key: 'dataProducao', label: 'Data Prod.' },
  { key: 'dataValidadeLote', label: 'Val. Lote' },
  { key: 'custoStr', label: 'Custo Total', align: 'right' },
]

const EMPTY_PERDA = { quantidadePerdida: '', motivoPerda: '', dataPerda: '' }

export default function ProducaoPage() {

  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [producoes, setProducoes] = useState([])

  const [view, setView] = useState('stock')
  const [selectedRow, setRow] = useState(null)
  const [prodSearch, setProdS] = useState('')
  const [ingSearch, setIngS] = useState('')

  // Buscando os produtos da API
  useEffect(() => {
    if (view === 'stock') {
      api.get('/produtos').then(res => setProducts(res.data)).catch(console.error);
    } else if (view === 'ingredients') {
      api.get('/ingredientes').then(res => setIngredients(res.data)).catch(console.error);
    } else if (view === 'history') {
      api.get('/producao').then(res => setProducoes(res.data)).catch(console.error);
    }
  }, [view]);

  // formato YYYY-MM-DD
  const getTodayISO = () => new Date().toISOString().split('T')[0];

  // modal nova produção
  const [modalProd, setModalProd] = useState(false)
  const [addCode, setAddCode] = useState('')
  const [prodQtd, setProdQtd] = useState('')
  const [dataProducao, setDataProd] = useState(getTodayISO())
  const [selectedProductId, setSelProdId] = useState('')

  // modal registrar perda
  const [modalPerda, setModalPerda] = useState(false)
  const [perdaForm, setPerdaForm] = useState(EMPTY_PERDA)
  const [selProducao, setSelProducao] = useState(null)

  useEffect(() => {
    if (view === 'stock') {
      api.get('/produtos').then(res => setProducts(res.data)).catch(console.error);
    } else if (view === 'ingredients') {
      api.get('/ingredientes').then(res => setIngredients(res.data)).catch(console.error);
    } else if (view === 'history') {
      api.get('/producao').then(res => setProducoes(res.data)).catch(console.error);
    }
  }, [view]);

  const formatarDataBR = (dataIso) => {
    if (!dataIso) return '';
    const [ano, mes, dia] = String(dataIso).split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // produto selecionado para produção
  const productForProd = useMemo(
    () => products.find(p => p.idProduto === selectedProductId || p.codigoBarras === addCode || p.nomeProduto === addCode),
    [selectedProductId, addCode, products]
  )

  const validadeLoteCalc = useMemo(() => {
    if (!productForProd) return '';
    const dataProdBase = new Date(dataProducao + 'T12:00:00');
    dataProdBase.setDate(dataProdBase.getDate() + (productForProd.diasValidadePadrao || 0));
    return formatarDataBR(dataProdBase.toISOString());
  }, [productForProd, dataProducao]);

  const custoProducaoCalc = useMemo(() => {
    return 0;
  }, [productForProd, prodQtd]);

  // Dados das tabelas
  const stockRows = useMemo(() => {
    const q = prodSearch.toLowerCase()
    return products
      .filter(p => !q || p.nomeProduto.toLowerCase().includes(q) || String(p.codigoBarras).includes(q))
      .map(p => ({
        ...p,
        id: p.idProduto,
        name: p.nomeProduto,
        code: p.codigoBarras,
        precoStr: `R$ ${Number(p.precoBalcao || 0).toFixed(2).replace('.', ',')}`,
        qtdeStr: String(p.quantidadeEstoque || 0),
        validity: p.diasValidadePadrao ? `${p.diasValidadePadrao} dias` : '-',
      }))
  }, [products, prodSearch])

  const ingRows = useMemo(() => {
    const q = ingSearch.toLowerCase()
    return ingredients
      .filter(i => !q || i.nomeIngrediente.toLowerCase().includes(q) || String(i.idIngrediente).includes(q))
      .map(i => {
        const baixo = i.quantidadeEstoque <= i.estoqueMinimo
        return {
          ...i,
          id: i.idIngrediente,
          name: i.nomeIngrediente,
          code: i.idIngrediente,
          custoStr: `R$ ${Number(i.custoMedioUnitario || 0).toFixed(4).replace('.', ',')}`,
          qtdeStr: `${i.quantidadeEstoque} ${i.unidadeMedida}`,
          validade: 'Ver Entradas', // A validade agora fica na tabela de Compras
          estoqueStatus: baixo
            ? <span className="text-xs text-red font-bold">⚠ Baixo</span>
            : <span className="text-xs text-green font-bold">OK</span>,
        }
      })
  }, [ingredients, ingSearch])

  const producaoRows = useMemo(() =>
    producoes.map(p => ({
      ...p,
      id: p.idProducao,
      code: p.idProducao,
      nomeProduto: products.find(prod => prod.idProduto === p.idProduto)?.nomeProduto || 'Produto ID: ' + p.idProduto,
      dataProducao: formatarDataBR(p.dataProducao),
      dataValidadeLote: formatarDataBR(p.dataValidade),
      custoStr: p.lote,
    }))
    , [producoes, products])

  const idUsuarioLogado = 5;

  // salva producao de produto
  async function saveProducao() {
    if (!productForProd) { alert('Produto não encontrado.'); return }
    if (!prodQtd || parseFloat(prodQtd) <= 0) { alert('Informe a quantidade produzida.'); return }

    const dataProdBase = new Date(dataProducao + 'T12:00:00');
    dataProdBase.setDate(dataProdBase.getDate() + (productForProd.diasValidadePadrao || 1));
    const dataValCalculada = dataProdBase.toISOString().split('T')[0];

    // código de lote automático
    const loteGerado = `LT-${new Date().getTime().toString().slice(-6)}`;


    const payload = {
      idProduto: productForProd.idProduto,
      quantidadeProduzida: parseFloat(prodQtd),
      lote: loteGerado,
      dataValidade: dataValCalculada,
      dataProducao: `${dataProducao}T12:00:00`,
      idUsuario: idUsuarioLogado,
    };

    try {
      const res = await api.post('/producao', payload);
      setProducoes([...producoes, res.data]);
      setAddCode(''); setProdQtd(''); setSelProdId(''); setModalProd(false);
      alert("Produção registrada com sucesso! Lote: " + loteGerado);

      setProducts(prev => prev.map(p => p.idProduto === productForProd.idProduto ? { ...p, quantidadeEstoque: (p.quantidadeEstoque || 0) + payload.quantidadeProduzida } : p));

    } catch (error) {
      console.error("Erro ao salvar produção:", error);
      alert("Erro ao registrar a produção.");
    }
  }

  // salva perda de producao
  async function savePerda() {
    if (!perdaForm.quantidadePerdida || !perdaForm.motivoPerda) { alert('Preencha quantidade e motivo.'); return }

    const payload = {
      idProducao: selProducao.idProducao,
      idProduto: selProducao.idProduto,
      quantidadePerdida: parseFloat(perdaForm.quantidadePerdida),
      motivoPerda: perdaForm.motivoPerda,
      dataPerda: perdaForm.dataPerda ? `${perdaForm.dataPerda}T12:00:00` : `${getTodayISO()}T12:00:00`,
      idUsuario: idUsuarioLogado,
    };

    try {
      await api.post('/perdas', payload);
      setPerdaForm(EMPTY_PERDA); setSelProducao(null); setModalPerda(false);
      alert("Perda registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar perda:", error);
      alert("Erro ao registrar a perda no sistema.");
    }
  }

  function openRegistrarPerda(prod) {
    setSelProducao(prod)
    setPerdaForm({ ...EMPTY_PERDA, dataPerda: getTodayISO() })
    setModalPerda(true)
  }

  useKeyboardShortcut([
    { key: 'F9', fn: () => modalProd ? saveProducao() : modalPerda ? savePerda() : setModalProd(true) },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Produção" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* ── Controles superiores ─────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <img src={logoFull} alt="PanControl+" className="h-24 object-contain flex-shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            {/* Linha de ações */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-28 text-right">Produções:</span>
              <div className="flex-1" />
              <Button variant="green" shortcut="F9" onClick={() => setModalProd(true)}>Novo+</Button>
              <Button variant="red">Excluir</Button>
            </div>
            <SearchRow label="Estoque:" value={view === 'stock' ? prodSearch : ''} onChange={v => { setView('stock'); setProdS(v) }} placeholder="Todos" active={view === 'stock'} onClick={() => setView('stock')} />
            <SearchRow label="Ingredientes:" value={view === 'ingredients' ? ingSearch : ''} onChange={v => { setView('ingredients'); setIngS(v) }} placeholder="Todos" active={view === 'ingredients'} onClick={() => setView('ingredients')} />
            <SearchRow label="Histórico:" value="" onChange={() => { }} placeholder="-" active={view === 'history'} onClick={() => setView('history')} />
          </div>
        </div>

        {/* ── Tabelas ───────────────────────────────────────────────────── */}
        <p className="font-bold text-sm text-gray-800">
          {view === 'stock' ? 'Estoque disponível:' : view === 'ingredients' ? 'Ingredientes disponíveis:' : 'Histórico de Produções:'}
        </p>
        <div className="flex-1 overflow-y-auto pan-scroll max-h-[380px]">
          {view === 'stock' && <DataTable columns={STOCK_COLS} rows={stockRows} selectedId={selectedRow?.id} onSelect={setRow} />}
          {view === 'ingredients' && <DataTable columns={ING_COLS} rows={ingRows} selectedId={selectedRow?.id} onSelect={setRow} />}
          {view === 'history' && (
            <div>
              <DataTable columns={PROD_COLS} rows={producaoRows} selectedId={selProducao?.id}
                onSelect={row => { setSelProducao(row); setRow(row) }} />
            </div>
          )}
        </div>

        {/* Botões contextuais */}
        <div className="flex justify-end gap-3">
          {view === 'history' && selProducao && (
            <Button variant="red" onClick={() => openRegistrarPerda(selProducao)}>
              Registrar Perda
            </Button>
          )}
          {selectedRow && view !== 'history' && (
            <Button variant="gold">
              {view === 'stock' ? 'Alterar produto' : 'Alterar ingrediente'}
            </Button>
          )}
        </div>
      </main>

      {/* ── Modal Nova Produção ──────────────────────────────────────────── */}
      <Modal isOpen={modalProd} onClose={() => setModalProd(false)} className="w-[640px]">
        <div className="p-6 flex flex-col gap-4">
          <h2 className="font-bold text-lg text-gray-800">Nova Produção</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Produto (código ou nome):</label>
              <div className="flex gap-2">
                <input value={addCode} onChange={e => { setAddCode(e.target.value); setSelProdId('') }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const found = products.find(p => p.codigoBarras === addCode.trim() || p.nomeProduto.toLowerCase() === addCode.toLowerCase().trim())
                      if (found) setSelProdId(found.idProduto)
                    }
                  }}
                  placeholder="Digite o código ou nome..."
                  className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                <Button variant="brown" onClick={() => {
                  const found = products.find(p => p.codigoBarras === addCode.trim() || p.nomeProduto.toLowerCase().includes(addCode.toLowerCase().trim()))
                  if (found) setSelProdId(found.idProduto)
                  else alert('Produto não encontrado.')
                }}>Buscar</Button>
              </div>
              {addCode.length > 1 && !productForProd && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mt-1 max-h-32 overflow-y-auto pan-scroll">
                  {products.filter(p => p.nomeProduto.toLowerCase().includes(addCode.toLowerCase()) || String(p.codigoBarras).includes(addCode)).map(p => (
                    <button key={p.idProduto} onClick={() => { setAddCode(p.nomeProduto); setSelProdId(p.idProduto) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      {p.codigoBarras} — {p.nomeProduto}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {productForProd && (
              <div className="col-span-2 bg-green/10 border border-green/30 rounded-lg px-4 py-2 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-green">{productForProd.name}</p>
                  <p className="text-xs text-gray-500">Validade padrão: {productForProd.diasValidadePadrao} dia(s) · {(productForProd.fichasTecnica || []).length} ingrediente(s) na ficha</p>
                </div>
              </div>
            )}

            <PF label="Data de Produção:" value={dataProducao} onChange={setDataProd} type="date" />
            <PF label="Quantidade Produzida:" value={prodQtd} onChange={setProdQtd} type="number" />
          </div>

          {/* Resumo calculado */}
          {productForProd && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">DATA DE VALIDADE DO LOTE:</p>
                <p className="text-lg font-bold text-header">{validadeLoteCalc || '—'}</p>
                <p className="text-[10px] text-gray-400">min(data + {productForProd.diasValidadePadrao}d, lotes dos ingredientes)</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">CUSTO TOTAL DE PRODUÇÃO:</p>
                <p className="text-lg font-bold text-red">R$ {custoProducaoCalc.toFixed(2).replace('.', ',')}</p>
                <p className="text-[10px] text-gray-400">Custo unitário × {prodQtd || 0} unidade(s)</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveProducao}>Salvar Produção</Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Registrar Perda ─────────────────────────────────────────── */}
      <Modal isOpen={modalPerda} onClose={() => setModalPerda(false)} className="w-[500px]">
        <div className="p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-1">Registrar Perda</h2>
          {selProducao && (
            <p className="text-sm text-gray-500 mb-4">
              Produção <b>{selProducao.code}</b> — {selProducao.nomeProduto} · Val. Lote: {selProducao.dataValidadeLote}
            </p>
          )}
          <div className="flex flex-col gap-3">
            <PF label="Quantidade Perdida:" value={perdaForm.quantidadePerdida} onChange={v => setPerdaForm(f => ({ ...f, quantidadePerdida: v }))} type="number" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Motivo da Perda:</label>
              <select value={perdaForm.motivoPerda} onChange={e => setPerdaForm(f => ({ ...f, motivoPerda: e.target.value }))}
                className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="">Selecione...</option>
                {['Produto vencido', 'Dano físico', 'Erro de produção', 'Contaminação', 'Excesso de produção', 'Outro'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <PF label="Data da Perda:" value={perdaForm.dataPerda} onChange={v => setPerdaForm(f => ({ ...f, dataPerda: v }))} type="date" />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="red" size="lg" shortcut="F9" onClick={savePerda}>Confirmar Perda</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SearchRow({ label, value, onChange, placeholder, active, onClick }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold w-28 text-right flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
        <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400" />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Button variant={active ? 'brown' : 'cream'} onClick={onClick}>Consultar</Button>
    </div>
  )
}

function PF({ label, value, onChange, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>}
      <input type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold w-full" />
    </div>
  )
}
