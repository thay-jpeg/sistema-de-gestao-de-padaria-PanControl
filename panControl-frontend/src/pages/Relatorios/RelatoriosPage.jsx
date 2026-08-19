import { useState, useMemo } from 'react'
import Header     from '@/components/layout/Header'
import Button     from '@/components/ui/Button'
import DataTable  from '@/components/ui/DataTable'
import logoFull   from '@/assets/images/logo-full.png'

const REPORT_TYPES = [
  { key: 'vendas',      label: 'Relatório de Vendas'      },
  { key: 'estoque',     label: 'Relatório de Estoque'     },
  { key: 'ingredientes',label: 'Relatório de Ingredientes'},
  { key: 'pedidos',     label: 'Relatório de Pedidos'     }
]

const COLS_MAP = {
  vendas: [
    { key: 'id',     label: 'ID Venda' },
    { key: 'data',   label: 'Data'     },
    { key: 'metodo', label: 'Pagamento'},
    { key: 'total',  label: 'Total',   align: 'right' },
  ],
  estoque: [
    { key: 'code',          label: 'Cód.'           },
    { key: 'name',          label: 'Produto'        },
    { key: 'qtdeStr',       label: 'Estoque Atual', align: 'right' },
    { key: 'precoBalcaoStr',label: 'Preço Balcão',  align: 'right' },
    { key: 'precoAtacadoStr',label:'Preço Atacado', align: 'right' },
  ],
  ingredientes: [
    { key: 'code',     label: 'Cód.',         align: 'center' },
    { key: 'name',     label: 'Descrição'                     },
    { key: 'medida',   label: 'Medida',       align: 'center' },
    { key: 'custoStr', label: 'Custo Médio',  align: 'right'  },
    { key: 'qtdeStr',  label: 'Estoque',      align: 'right'  },
  ],
  pedidos: [
    { key: 'id',         label: 'ID Pedido' },
    { key: 'dataPedido', label: 'Data'      },
    { key: 'nomeCliente',label: 'Cliente'   },
    { key: 'totalStr',   label: 'Total',    align: 'right' },
    { key: 'situacao',   label: 'Status'    },
  ]
}

export default function RelatoriosPage() {
  const [type,  setType]  = useState('vendas')
  const [from,  setFrom]  = useState('')
  const [to,    setTo]    = useState('')
  const [rows,  setRows]  = useState([])
  const [ranBusca, setRanBusca] = useState(false)

  async function handleSearch() {
    setRanBusca(true)
    setRows([])

    const queryParams = new URLSearchParams()
    if (from) queryParams.append('dataInicio', from)
    if (to) queryParams.append('dataFim', to)
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

    try {
      switch (type) {
        case 'vendas': {
          const res = await fetch(`http://localhost:8080/api/relatorios/vendas${queryString}`)
          if (res.ok) {
            const data = await res.json()
            setRows(data.map(v => ({
              id: v.idVenda,
              data: new Date(v.dataVenda).toLocaleDateString(),
              metodo: v.metodoPagamento,
              total: `R$ ${Number(v.valorTotal || 0).toFixed(2).replace('.', ',')}`,
              valorCru: v.valorTotal
            })))
          }
          break
        }
        case 'pedidos': {
          const res = await fetch(`http://localhost:8080/api/relatorios/pedidos${queryString}`)
          if (res.ok) {
            const data = await res.json()
            setRows(data.map(p => ({
              id: p.idPedidoVenda,
              dataPedido: new Date(p.dataPedido).toLocaleDateString(),
              nomeCliente: p.clienteAtacadista?.nomeRazaoSocial || 'Avulso',
              totalStr: `R$ ${Number(p.valorTotal || 0).toFixed(2).replace('.', ',')}`,
              situacao: p.situacao,
              valorCru: p.valorTotal
            })))
          }
          break
        }
        case 'estoque': {
          // Estoque atual não precisa de filtro de data, busca os produtos
          const res = await fetch('http://localhost:8080/api/produtos')
          if (res.ok) {
            const data = await res.json()
            setRows(data.map(p => ({
              id: p.idProduto,
              code: p.codigoBarras || String(p.idProduto),
              name: p.nomeProduto,
              qtdeStr: String(p.quantidadeEstoque || 0),
              precoBalcaoStr: `R$ ${Number(p.precoBalcao || 0).toFixed(2).replace('.', ',')}`,
              precoAtacadoStr: `R$ ${Number(p.precoAtacado || 0).toFixed(2).replace('.', ',')}`
            })))
          }
          break
        }
        case 'ingredientes': {
          const res = await fetch(`http://localhost:8080/api/relatorios/ingredientes${queryString}`)
          if (res.ok) {
            const data = await res.json()
            setRows(data.map((ing) => ({
              id: ing.idIngrediente,
              code: String(ing.idIngrediente).padStart(3, '0'),
              name: ing.nome, // Mapeado do getNome() da Projection
              medida: ing.medida, // Mapeado do getMedida() da Projection
              custoStr: `R$ ${Number(ing.custo || 0).toFixed(4).replace('.', ',')}`, // getCusto()
              qtdeStr: String(ing.estoque) // getEstoque()
            })))
          }
          break
        }
        default: setRows([])
      }
    } catch (error) {
      console.error("Erro na busca do relatório:", error)
      alert("Falha de comunicação com a API de relatórios.")
    }
  }

  const totalValor = useMemo(() => {
    if (type === 'vendas' || type === 'pedidos') {
      return rows.reduce((s, r) => s + (r.valorCru || 0), 0)
    }
    return null
  }, [rows, type])

  const cols = COLS_MAP[type] || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Relatórios" showBack />

      <main className="flex-1 flex flex-col p-6 gap-5">
        <div className="flex items-start gap-4">
          <img src={logoFull} alt="Logo" className="h-24 object-contain flex-shrink-0" />

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20 text-right">Tipo:</span>
              <select value={type} onChange={e => { setType(e.target.value); setRows([]); setRanBusca(false) }}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                {REPORT_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <Button variant="green" onClick={handleSearch}>Buscar Dados do SGBD</Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20 text-right">Período:</span>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" disabled={type === 'estoque'} />
              <span className="text-sm text-gray-500">até</span>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" disabled={type === 'estoque'} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-gray-800">
              {REPORT_TYPES.find(t => t.key === type)?.label}:
            </p>
            {rows.length > 0 && totalValor !== null && (
              <p className="text-sm font-semibold text-gray-600">
                Total do Período: <span className="text-green font-bold">R$ {totalValor.toFixed(2).replace('.', ',')}</span>
              </p>
            )}
          </div>

          {!ranBusca ? (
            <div className="flex-1 border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-sm">Selecione o tipo, defina as datas e clique em <b>Buscar Dados do SGBD</b>.</p>
              </div>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto pan-scroll flex-1">
              <DataTable columns={cols} rows={rows} rowKey="id" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}