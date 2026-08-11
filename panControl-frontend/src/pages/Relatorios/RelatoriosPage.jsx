import { useState } from 'react'
import Header       from '@/components/layout/Header'
import Button       from '@/components/ui/Button'
import DataTable    from '@/components/ui/DataTable'
import logoFull     from '@/assets/images/logo-full.png'

const REPORT_TYPES = ['Relatório de Venda', 'Relatório de Produção', 'Relatório de Estoque', 'Relatório de Clientes']

const MOCK_SALES = [
  { id: '1', name: 'Pão Francês',    nfe: 'NF-001', code: '110', priceStr: 'R$1,50',  qty: 10 },
  { id: '2', name: 'Broche Caseiro', nfe: 'NF-001', code: '074', priceStr: 'R$7,98',  qty: 3  },
  { id: '3', name: 'Cacetinho',      nfe: 'NF-002', code: '020', priceStr: 'R$9,98',  qty: 5  },
]

const COLS = [
  { key: 'name',     label: 'Descrição' },
  { key: 'nfe',      label: 'NFE',   align: 'right' },
  { key: 'code',     label: 'Cód',   align: 'right' },
  { key: 'priceStr', label: 'Preço', align: 'right' },
  { key: 'qty',      label: 'Qtde',  align: 'right' },
]

export default function RelatoriosPage() {
  const [type,  setType]  = useState(REPORT_TYPES[0])
  const [from,  setFrom]  = useState('')
  const [to,    setTo]    = useState('')
  const [rows,  setRows]  = useState([])

  function handleSearch() { setRows(MOCK_SALES) }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Relatórios" showBack />

      <main className="flex-1 flex flex-col p-6 gap-5">
        {/* Controles */}
        <div className="flex items-center gap-4">
          <img src={logoFull} alt="" className="h-24 object-contain" />

          <div className="flex flex-col gap-3 flex-1">
            {/* Tipo */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20">Tipo:</span>
              <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                >
                  {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Button variant="green" onClick={handleSearch}>Buscar</Button>
            </div>

            {/* Período */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-20">Período:</span>
              <DateField value={from} onChange={setFrom} />
              <span className="text-sm text-gray-500">até</span>
              <DateField value={to}   onChange={setTo}   />
              <Button variant="brown">Filtrar</Button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div>
          <p className="font-bold text-sm mb-2 text-gray-800">Vendas:</p>
          <div className="max-h-[400px] overflow-y-auto pan-scroll">
            <DataTable
              columns={COLS}
              rows={rows}
              rowKey="id"
            />
          </div>
        </div>

        {/* Ação */}
        <div className="flex justify-end">
          <Button variant="red" size="lg" onClick={() => alert('Gerando documento... (mock)')}>
            Gerar documento
          </Button>
        </div>
      </main>
    </div>
  )
}

function DateField({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-1 bg-input-bg border border-gray-200 rounded px-3 py-2">
      <input
        type="date"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="flex-1 bg-transparent text-sm focus:outline-none"
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  )
}
