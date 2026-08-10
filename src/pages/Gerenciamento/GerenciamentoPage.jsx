import { useState } from 'react'
import Header        from '@/components/layout/Header'
import Button        from '@/components/ui/Button'
import Modal         from '@/components/ui/Modal'
import { CLIENTS }   from '@/mocks/data/clients'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'

const TABS = [
  { key: 'clientes',     label: 'Clientes'     },
  { key: 'usuarios',     label: 'Usuários'     },
  { key: 'ingredientes', label: 'Ingredientes' },
]

const EMPTY_CLIENT = {
  code: '', name: '', cpf: '', birth: '', country: '', email: '',
  phone: '', cep: '', address: '', neighborhood: '', city: '', complement: '',
}

export default function GerenciamentoPage() {
  const [tab,       setTab]     = useState('clientes')
  const [clients,   setClients] = useState(CLIENTS)
  const [selected,  setSel]     = useState(null)
  const [formData,  setForm]    = useState(EMPTY_CLIENT)
  const [modalOpen, setModal]   = useState(false)
  const [isNew,     setIsNew]   = useState(false)

  function openNew() {
    setIsNew(true)
    setSel(null)
    setForm({ ...EMPTY_CLIENT, code: `0000${String(clients.length + 41).padStart(4, '0')}` })
    setModal(true)
  }

  function openEdit(client) {
    setIsNew(false)
    setSel(client)
    setForm({ ...client })
    setModal(true)
  }

  function saveClient() {
    alert('Cliente salvo! (mock)')
    setModal(false)
  }

  function deleteClient() {
    if (!confirm('Excluir este cliente?')) return
    setClients(prev => prev.filter(c => c.code !== selected?.code))
    setModal(false)
  }

  useKeyboardShortcut([
    { key: 'F9',  fn: () => modalOpen ? saveClient() : openNew() },
    { key: 'F10', fn: () => modalOpen && deleteClient() },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Gerenciamento" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* Abas */}
        <div className="flex gap-2 border-b border-gray-200 pb-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-5 py-2.5 font-bold text-sm rounded-t-lg transition border border-b-0',
                tab === t.key
                  ? 'bg-header text-white border-header'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <Button variant="green" onClick={openNew}>+ Novo</Button>
        </div>

        {/* Conteúdo da aba Clientes */}
        {tab === 'clientes' && (
          <div className="flex-1 border border-gray-200 rounded-b-lg rounded-tr-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brown text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Cód</th>
                  <th className="px-4 py-3 text-left font-bold">Nome</th>
                  <th className="px-4 py-3 text-left font-bold">CPF/CNPJ</th>
                  <th className="px-4 py-3 text-left font-bold">Cidade</th>
                  <th className="px-4 py-3 text-left font-bold">Tel.</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr
                    key={c.code}
                    onClick={() => openEdit(c)}
                    className={`cursor-pointer hover:bg-yellow-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3">{c.code}</td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.cpf}</td>
                    <td className="px-4 py-3">{c.city}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'usuarios' && (
          <div className="text-gray-400 text-sm py-10 text-center">
            Gestão de usuários — a implementar com API.
          </div>
        )}

        {tab === 'ingredientes' && (
          <div className="text-gray-400 text-sm py-10 text-center">
            Cadastro de ingredientes disponível na tela de Produção.
          </div>
        )}
      </main>

      {/* Modal Cadastro/Edição de Cliente */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[780px]">
        <div className="p-6">
          <div className="flex gap-6 mb-5">
            {/* Avatar */}
            <div className="w-44 h-44 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>

            {/* Campos */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 col-span-1">
                <span className="font-bold text-sm whitespace-nowrap">Cliente:</span>
                <div className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 flex-1">{formData.code}</div>
              </div>
              <CF label="Nome:"   value={formData.name}  onChange={v => setForm(f => ({...f, name: v}))} className="col-span-2" />
              <CF label="CPF/CNPJ:" value={formData.cpf}  onChange={v => setForm(f => ({...f, cpf: v}))} />
              <CF label="Nasc.:"  value={formData.birth} onChange={v => setForm(f => ({...f, birth: v}))} type="date" />
              <CF label="País:"   value={formData.country} onChange={v => setForm(f => ({...f, country: v}))} />
              <CF label="E-mail:" value={formData.email} onChange={v => setForm(f => ({...f, email: v}))} className="col-span-2" />
              <CF label="Tel.:"   value={formData.phone} onChange={v => setForm(f => ({...f, phone: v}))} />
              <CF label="CEP:"    value={formData.cep}   onChange={v => setForm(f => ({...f, cep: v}))} />
              <CF label="Endereço:" value={formData.address}      onChange={v => setForm(f => ({...f, address: v}))} className="col-span-2" />
              <CF label="Bairro:"  value={formData.neighborhood}  onChange={v => setForm(f => ({...f, neighborhood: v}))} />
              <CF label="Complemento:" value={formData.complement} onChange={v => setForm(f => ({...f, complement: v}))} className="col-span-2" />
              <CF label="Cidade:"  value={formData.city} onChange={v => setForm(f => ({...f, city: v}))} />
            </div>
          </div>

          {/* Atalhos */}
          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" shortcut="F9"  onClick={saveClient}>Cadastrar</Button>
            {!isNew && <Button variant="red" size="lg" shortcut="F10" onClick={deleteClient}>Excluir cliente</Button>}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function CF({ label, value, onChange, type = 'text', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600">{label}</label>}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold w-full"
      />
    </div>
  )
}
