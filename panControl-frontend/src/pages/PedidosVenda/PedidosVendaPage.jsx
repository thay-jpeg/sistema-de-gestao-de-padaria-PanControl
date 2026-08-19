import React, { useState, useMemo, useEffect } from 'react'
import Header      from '@/components/layout/Header'
import Button      from '@/components/ui/Button'
import Modal       from '@/components/ui/Modal'

const SITUACOES = ['todos','pendente','entregue','cancelado']
const SITUACAO_CFG = {
  pendente:   { label:'Pendente',   cls:'bg-amber-50 text-amber-700 border-amber-200'  },
  entregue:   { label:'Entregue',   cls:'bg-green/10 text-green border-green/30'       },
  cancelado:  { label:'Cancelado',  cls:'bg-red/10 text-red border-red/30'             },
}

export default function PedidosVendaPage() {
  const [pedidos, setPedidos] = useState([])
  const [filtroSit, setFiltroSit] = useState('todos')
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState(null)
  const [modalOpen, setModal]     = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  // Buscar pedidos reais da API ao carregar a tela
  useEffect(() => {
    fetchPedidos()
  }, [])

  async function fetchPedidos() {
    try {
      const response = await fetch('http://localhost:8080/api/pedidos')
      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return pedidos.filter(p => {
      const matchSit = filtroSit==='todos' || p.situacao===filtroSit
      const matchQ   = !q || p.clienteAtacadista?.nomeRazaoSocial?.toLowerCase().includes(q) || String(p.idPedidoVenda || p.id).includes(q)
      return matchSit && matchQ
    })
  }, [pedidos, filtroSit, search])

  const counts = useMemo(() => {
    const r = { todos: pedidos.length, pendente:0, entregue:0, cancelado:0 }
    pedidos.forEach(p => { if(r[p.situacao]!==undefined) r[p.situacao]++ })
    return r
  }, [pedidos])

  function openDetail(pedido) { setSelected(pedido); setModal(true) }

  async function cancelarPedidoAPI(id) {
    setConfirmAction({
      label: 'Deseja cancelar este pedido? O estoque será devolvido.',
      fn: async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/pedidos/${id}/cancelar`, {
            method: 'PUT'
          })
          if (response.ok) {
            alert('Pedido cancelado e estoque estornado com sucesso!')
            fetchPedidos()
            setModal(false)
            setSelected(null)
          } else {
            alert('Erro ao cancelar pedido.')
          }
        } catch (error) {
          alert('Falha de comunicação com o servidor.')
        }
        setConfirmAction(null)
      },
    })
  }

  const valorTotal = useMemo(() =>
    filtered.reduce((s,p)=>s+(p.valorTotal||0), 0)
  , [filtered])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Gerenciamento de Pedidos de Venda" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">

        {/* ── KPIs rápidos ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {SITUACOES.map(s=>(
            <button key={s} onClick={()=>setFiltroSit(s)}
              className={`rounded-xl border-2 p-3 text-left transition
                ${filtroSit===s?'border-header bg-header text-white':'border-gray-200 bg-white hover:border-gray-300'}`}>
              <p className={`text-2xl font-bold ${filtroSit===s?'text-white':''}`}>{counts[s]||0}</p>
              <p className={`text-xs font-semibold capitalize mt-0.5 ${filtroSit===s?'text-white/80':'text-gray-500'}`}>
                {s==='todos'?'Total':SITUACAO_CFG[s]?.label}
              </p>
            </button>
          ))}
        </div>

        {/* ── Busca e sumário ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar por cliente ou ID do pedido..."
            className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} pedido(s) · Total: <b className="text-gray-800">R$ {valorTotal.toFixed(2).replace('.',',')}</b>
          </div>
        </div>

        {/* ── Tabela ───────────────────────────────────────────────────── */}
        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brown text-white sticky top-0">
              <tr>
                {['ID','Data','Cliente','Valor Total','Itens','Situação','Ações'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const pId = p.idPedidoVenda || p.id
                const cfg = SITUACAO_CFG[p.situacao]||{}
                return (
                  <tr key={pId} className={`${i%2===0?'bg-white':'bg-gray-50'} hover:bg-yellow-50 transition cursor-pointer`}
                    onClick={()=>openDetail(p)}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{pId}</td>
                    <td className="px-4 py-3">{p.dataPedido ? new Date(p.dataPedido).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 font-semibold">{p.clienteAtacadista?.nomeRazaoSocial || '—'}</td>
                    <td className="px-4 py-3 font-bold">R$ {Number(p.valorTotal||0).toFixed(2).replace('.',',')}</td>
                    <td className="px-4 py-3 text-gray-500">{(p.itens||[]).length} item(s)</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e=>e.stopPropagation()}>
                      <div className="flex gap-1">
                        {p.situacao==='pendente' &&
                          <ActionBtn label="Cancelar" cls="text-red hover:bg-red/10 border-red/30" onClick={()=>cancelarPedidoAPI(pId)} />}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length===0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Nenhum pedido encontrado.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Modal Detalhe do Pedido ───────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={()=>setModal(false)} className="w-[680px]">
        {selected && (
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg">Pedido #{selected.idPedidoVenda || selected.id}</h2>
                <p className="text-sm text-gray-500">{selected.clienteAtacadista?.nomeRazaoSocial}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${SITUACAO_CFG[selected.situacao]?.cls}`}>
                {SITUACAO_CFG[selected.situacao]?.label}
              </span>
            </div>

            <p className="font-bold text-sm mb-2">Itens do pedido:</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Produto</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-600">Qtde</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-600">Preço Unit.</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(selected.itens||[]).map((it,i)=>(
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium">{it.produto?.nomeProduto || it.nomeProduto}</td>
                      <td className="px-4 py-2.5 text-right">{it.quantidade}</td>
                      <td className="px-4 py-2.5 text-right">R$ {Number(it.precoUnitarioAplicado||0).toFixed(2).replace('.',',')}</td>
                      <td className="px-4 py-2.5 text-right font-bold">R$ {(it.quantidade*(it.precoUnitarioAplicado||0)).toFixed(2).replace('.',',')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="px-4 py-2.5 font-bold text-right">TOTAL:</td>
                    <td className="px-4 py-2.5 font-bold text-green text-right">
                      R$ {Number(selected.valorTotal||0).toFixed(2).replace('.',',')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selected.situacao==='pendente' &&
                <Button variant="red" onClick={()=>cancelarPedidoAPI(selected.idPedidoVenda || selected.id)}>Cancelar Pedido (Estornar)</Button>}
            </div>

            {confirmAction && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-4">
                <p className="text-sm text-amber-800 flex-1">{confirmAction.label}</p>
                <button onClick={confirmAction.fn}
                  className="bg-header text-white text-xs font-bold px-3 py-1.5 rounded hover:opacity-80 transition">
                  Confirmar
                </button>
                <button onClick={()=>setConfirmAction(null)}
                  className="text-gray-500 text-xs font-bold px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function ActionBtn({ label, cls, onClick }) {
  return (
    <button onClick={onClick}
      className={`text-xs font-bold px-2.5 py-1 rounded border transition ${cls}`}>
      {label}
    </button>
  )
}