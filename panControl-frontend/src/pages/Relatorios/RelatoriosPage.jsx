import { useState, useMemo } from 'react'
import Header     from '@/components/layout/Header'
import Button     from '@/components/ui/Button'
import DataTable  from '@/components/ui/DataTable'
import logoFull   from '@/assets/images/logo-full.png'
import { useData } from '@/context/DataContext'

const REPORT_TYPES = [
  { key: 'vendas',      label: 'Relatório de Vendas'      },
  { key: 'producao',    label: 'Relatório de Produção'    },
  { key: 'estoque',     label: 'Relatório de Estoque'     },
  { key: 'ingredientes',label: 'Relatório de Ingredientes'},
  { key: 'pedidos',     label: 'Relatório de Pedidos'     },
  { key: 'perdas',      label: 'Relatório de Perdas'      },
]

const COLS_MAP = {
  vendas: [
    { key: 'id',     label: 'ID'       },
    { key: 'nome',   label: 'Produto'  },
    { key: 'qtde',   label: 'Qtde', align: 'right' },
    { key: 'preco',  label: 'Preço Unit.', align: 'right' },
    { key: 'total',  label: 'Total',   align: 'right' },
  ],
  producao: [
    { key: 'code',               label: 'Cód.'    },
    { key: 'nomeProduto',        label: 'Produto' },
    { key: 'quantidadeProduzida',label: 'Qtde Produzida', align: 'right' },
    { key: 'custoStr',           label: 'Custo Total',    align: 'right' },
    { key: 'dataProducao',       label: 'Data Prod.'      },
    { key: 'dataValidadeLote',   label: 'Val. Lote'       },
  ],
  estoque: [
    { key: 'code',          label: 'Cód.'           },
    { key: 'name',          label: 'Produto'        },
    { key: 'qtdeStr',       label: 'Estoque', align: 'right' },
    { key: 'precoBalcaoStr',label: 'Preço Balcão',  align: 'right' },
    { key: 'precoAtacadoStr',label:'Preço Atacado', align: 'right' },
  ],
  ingredientes: [
    { key: 'code',       label: 'Cód.'           },
    { key: 'name',       label: 'Ingrediente'    },
    { key: 'unidadeMedida', label: 'Un.'         },
    { key: 'qtdeStr',    label: 'Estoque', align: 'right' },
    { key: 'minStr',     label: 'Mín.',    align: 'right' },
    { key: 'custoStr',   label: 'Custo Médio',   align: 'right' },
    { key: 'status',     label: 'Status'         },
  ],
  pedidos: [
    { key: 'id',         label: 'ID'      },
    { key: 'dataPedido', label: 'Data'    },
    { key: 'nomeCliente',label: 'Cliente' },
    { key: 'totalStr',   label: 'Total',  align: 'right' },
    { key: 'itensQtde',  label: 'Itens',  align: 'right' },
    { key: 'situacao',   label: 'Status'  },
  ],
  perdas: [
    { key: 'id',               label: 'ID'         },
    { key: 'nomeProduto',      label: 'Produto'    },
    { key: 'quantidadePerdida',label: 'Qtde Perdida', align: 'right' },
    { key: 'motivoPerda',      label: 'Motivo'     },
    { key: 'dataPerda',        label: 'Data'       },
  ],
}

export default function RelatoriosPage() {
  const { products, ingredients, producoes, pedidos, perdas } = useData()

  const [type,  setType]  = useState('vendas')
  const [from,  setFrom]  = useState('')
  const [to,    setTo]    = useState('')
  const [rows,  setRows]  = useState([])
  const [ranBusca, setRanBusca] = useState(false)

  function inRange(dataBR) {
    if (!from && !to) return true
    const [d, m, y] = (dataBR || '').split('/')
    if (!d) return true
    const t = new Date(Number(y), Number(m) - 1, Number(d))
    if (from && t < new Date(from)) return false
    if (to   && t > new Date(to))   return false
    return true
  }

  function handleSearch() {
    setRanBusca(true)
    switch (type) {
      case 'vendas': {
        // Mock: usa itens dos pedidos entregues como proxy de vendas
        const vendaRows = pedidos
          .filter(p => p.situacao === 'entregue' && inRange(p.dataPedido))
          .flatMap(p => (p.itens || []).map((it, i) => ({
            id:    `${p.id}-${i + 1}`,
            nome:  it.nomeProduto,
            qtde:  it.quantidade,
            preco: `R$ ${Number(it.precoUnitarioAplicado || 0).toFixed(2).replace('.', ',')}`,
            total: `R$ ${(it.quantidade * (it.precoUnitarioAplicado || 0)).toFixed(2).replace('.', ',')}`,
          })))
        setRows(vendaRows)
        break
      }
      case 'producao': {
        setRows(producoes
          .filter(p => inRange(p.dataProducao))
          .map(p => ({ ...p, custoStr: `R$ ${Number(p.custoTotalProducao || 0).toFixed(2).replace('.', ',')}` })))
        break
      }
      case 'estoque': {
        setRows(products.map(p => ({
          ...p,
          qtdeStr:         String(p.quantidadeEstoque || 0),
          precoBalcaoStr:  `R$ ${Number(p.precoBalcao || 0).toFixed(2).replace('.', ',')}`,
          precoAtacadoStr: `R$ ${Number(p.precoAtacado || 0).toFixed(2).replace('.', ',')}`,
        })))
        break
      }
      case 'ingredientes': {
        setRows(ingredients.map(i => {
          const baixo = i.quantidadeEstoque <= i.estoqueMinimo
          return {
            ...i,
            qtdeStr:  `${i.quantidadeEstoque} ${i.unidadeMedida}`,
            minStr:   `${i.estoqueMinimo} ${i.unidadeMedida}`,
            custoStr: `R$ ${Number(i.custoMedioUnitario || 0).toFixed(4)}`,
            status:   baixo ? '⚠ Baixo' : 'OK',
          }
        }))
        break
      }
      case 'pedidos': {
        setRows(pedidos
          .filter(p => inRange(p.dataPedido))
          .map(p => ({
            ...p,
            totalStr:  `R$ ${Number(p.valorTotal || 0).toFixed(2).replace('.', ',')}`,
            itensQtde: (p.itens || []).length,
          })))
        break
      }
      case 'perdas': {
        setRows(perdas.filter(p => inRange(p.dataPerda)))
        break
      }
      default: setRows([])
    }
  }

  const totalValor = useMemo(() => {
    if (type === 'vendas') return rows.reduce((s, r) => {
      const v = parseFloat((r.total || '').replace('R$', '').replace(',', '.').trim()) || 0
      return s + v
    }, 0)
    if (type === 'pedidos') return rows.reduce((s, r) => s + (r.valorTotal || 0), 0)
    if (type === 'producao') return rows.reduce((s, r) => s + (r.custoTotalProducao || 0), 0)
    return null
  }, [rows, type])

  const cols = COLS_MAP[type] || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Relatórios" showBack />

      <main className="flex-1 flex flex-col p-6 gap-5">
        {/* Controles */}
        <div className="flex items-start gap-4">
          <img src={logoFull} alt="" className="h-24 object-contain flex-shrink-0" />

          <div className="flex flex-col gap-3 flex-1">
            {/* Tipo */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20 text-right">Tipo:</span>
              <select value={type} onChange={e => { setType(e.target.value); setRows([]); setRanBusca(false) }}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                {REPORT_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <Button variant="green" onClick={handleSearch}>Buscar</Button>
            </div>

            {/* Período */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20 text-right">Período:</span>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              <span className="text-sm text-gray-500">até</span>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              <Button variant="brown" onClick={handleSearch}>Filtrar</Button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-gray-800">
              {REPORT_TYPES.find(t => t.key === type)?.label}:
            </p>
            {rows.length > 0 && totalValor !== null && (
              <p className="text-sm font-semibold text-gray-600">
                Total: <span className="text-green font-bold">R$ {totalValor.toFixed(2).replace('.', ',')}</span>
              </p>
            )}
          </div>

          {!ranBusca ? (
            <div className="flex-1 border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-sm">Selecione o tipo e clique em <b>Buscar</b>.</p>
              </div>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto pan-scroll flex-1">
              <DataTable columns={cols} rows={rows} rowKey="id" />
            </div>
          )}
        </div>

        {/* Gerar documento */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{rows.length} registro(s) encontrado(s)</p>
            <Button variant="red" size="lg" onClick={() => alert('Gerando documento... (integração com API)')}>
              Gerar documento
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
