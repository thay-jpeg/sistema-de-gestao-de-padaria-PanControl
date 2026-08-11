import { useState, useMemo }   from 'react'
import Header                  from '@/components/layout/Header'
import Button                  from '@/components/ui/Button'
import Modal                   from '@/components/ui/Modal'
import { useData, brToISO, isoToBR } from '@/context/DataContext'
import { CLIENTS }             from '@/mocks/data/clients'
import useKeyboardShortcut     from '@/hooks/useKeyboardShortcut'

const TABS = [
  { key: 'clientes',     label: 'Clientes'     },
  { key: 'usuarios',     label: 'Usuários'     },
  { key: 'ingredientes', label: 'Ingredientes' },
]

// ─── Modelos vazios ───────────────────────────────────────────────────────────
const EMPTY_CLIENT = {
  code: '', name: '', cpf: '', birth: '', country: 'Brasil', email: '',
  phone: '', cep: '', address: '', neighborhood: '', city: '', complement: '',
}

const EMPTY_INGREDIENT = {
  code: '', name: '', price: '', qty: '', icms: '', validity: '', image: null, products: [],
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function GerenciamentoPage() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useData()

  const [tab,        setTab]    = useState('clientes')
  const [clients,    setClients]= useState(CLIENTS)
  const [ingSearch,  setIngSearch] = useState('')

  // ── estado do modal (compartilhado entre abas via "mode") ──
  const [modal,      setModal]  = useState({ open: false, mode: 'client', isNew: true })
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT)
  const [ingForm,    setIngForm]    = useState(EMPTY_INGREDIENT)
  const [selectedClient, setSelClient] = useState(null)
  const [selectedIng,    setSelIng]    = useState(null)

  // ingredientes filtrados pela busca
  const filteredIngs = useMemo(() => {
    const q = ingSearch.toLowerCase().trim()
    return q
      ? ingredients.filter(i => i.name.toLowerCase().includes(q) || i.code.includes(q))
      : ingredients
  }, [ingredients, ingSearch])

  // ── Helpers de abertura de modal ──────────────────────────────────────────
  function openNewClient() {
    setSelClient(null)
    setClientForm({
      ...EMPTY_CLIENT,
      code: `0000${String(clients.length + 41).padStart(4, '0')}`,
    })
    setModal({ open: true, mode: 'client', isNew: true })
  }

  function openEditClient(c) {
    setSelClient(c)
    setClientForm({ ...c })
    setModal({ open: true, mode: 'client', isNew: false })
  }

  function openNewIngredient() {
    setSelIng(null)
    setIngForm({ ...EMPTY_INGREDIENT })
    setModal({ open: true, mode: 'ingredient', isNew: true })
  }

  function openEditIngredient(ing) {
    setSelIng(ing)
    setIngForm({
      ...ing,
      // Converte DD/MM/YYYY → YYYY-MM-DD para o input type=date
      validity: brToISO(ing.validity),
    })
    setModal({ open: true, mode: 'ingredient', isNew: false })
  }

  function closeModal() {
    setModal(m => ({ ...m, open: false }))
  }

  // ── CRUD clientes ─────────────────────────────────────────────────────────
  function saveClient() {
    if (modal.isNew) {
      setClients(prev => [...prev, { ...clientForm }])
    } else {
      setClients(prev => prev.map(c => c.code === selectedClient?.code ? { ...clientForm } : c))
    }
    closeModal()
  }

  function removeClient() {
    if (!confirm('Excluir este cliente?')) return
    setClients(prev => prev.filter(c => c.code !== selectedClient?.code))
    closeModal()
  }

  // ── CRUD ingredientes ─────────────────────────────────────────────────────
  function saveIngredient() {
    const payload = {
      ...ingForm,
      price: parseFloat(String(ingForm.price).replace(',', '.')) || 0,
      qty:   parseInt(ingForm.qty)  || 0,
      icms:  parseFloat(ingForm.icms) || 0,
      // Armazena no formato BR
      validity: isoToBR(ingForm.validity) || ingForm.validity,
    }
    if (modal.isNew) {
      addIngredient(payload)
    } else {
      updateIngredient(selectedIng.id, payload)
    }
    closeModal()
  }

  function removeIngredient() {
    if (!confirm('Excluir este ingrediente? Ele será removido de todos os produtos associados.')) return
    deleteIngredient(selectedIng.id)
    closeModal()
  }

  // ── Atalhos de teclado ────────────────────────────────────────────────────
  useKeyboardShortcut([
    {
      key: 'F9', fn: () => {
        if (!modal.open) {
          if (tab === 'clientes')     openNewClient()
          if (tab === 'ingredientes') openNewIngredient()
          return
        }
        if (modal.mode === 'client')     saveClient()
        if (modal.mode === 'ingredient') saveIngredient()
      },
    },
    {
      key: 'F10', fn: () => {
        if (!modal.open || modal.isNew) return
        if (modal.mode === 'client')     removeClient()
        if (modal.mode === 'ingredient') removeIngredient()
      },
    },
  ])

  // ── Botão "Novo" contextual ───────────────────────────────────────────────
  function handleNew() {
    if (tab === 'clientes')     openNewClient()
    if (tab === 'ingredientes') openNewIngredient()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Gerenciamento" showBack />

      <main className="flex-1 flex flex-col p-6 gap-0">
        {/* Abas */}
        <div className="flex items-end gap-1 border-b border-gray-200">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-5 py-2.5 font-bold text-sm rounded-t-lg transition border border-b-0 -mb-px',
                tab === t.key
                  ? 'bg-header text-white border-header z-10'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          {tab !== 'usuarios' && (
            <Button variant="green" size="sm" onClick={handleNew} className="mb-1">
              + Novo
            </Button>
          )}
        </div>

        {/* ── Tab: Clientes ──────────────────────────────────────────────── */}
        {tab === 'clientes' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
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
                    onClick={() => openEditClient(c)}
                    className={`cursor-pointer hover:bg-yellow-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3">{c.code}</td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.cpf}</td>
                    <td className="px-4 py-3">{c.city}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum cliente cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab: Usuários ──────────────────────────────────────────────── */}
        {tab === 'usuarios' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg p-10 text-center">
            <p className="text-gray-400 text-sm">Gestão de usuários — disponível após integração com API.</p>
          </div>
        )}

        {/* ── Tab: Ingredientes ──────────────────────────────────────────── */}
        {tab === 'ingredientes' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg flex flex-col">
            {/* Barra de busca */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <input
                value={ingSearch}
                onChange={e => setIngSearch(e.target.value)}
                placeholder="Buscar ingrediente por nome ou código..."
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            {/* Tabela de ingredientes */}
            <div className="overflow-y-auto pan-scroll max-h-[520px]">
              <table className="w-full text-sm">
                <thead className="bg-brown text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Cód</th>
                    <th className="px-4 py-3 text-left font-bold">Descrição</th>
                    <th className="px-4 py-3 text-right font-bold">Preço compra</th>
                    <th className="px-4 py-3 text-right font-bold">Qtde em estoque</th>
                    <th className="px-4 py-3 text-center font-bold">Validade</th>
                    <th className="px-4 py-3 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngs.map((ing, i) => {
                    const status = validityStatus(ing.validity)
                    return (
                      <tr
                        key={ing.id}
                        onClick={() => openEditIngredient(ing)}
                        className={`cursor-pointer hover:bg-yellow-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-4 py-3 font-mono text-gray-500">{ing.code}</td>
                        <td className="px-4 py-3 font-semibold">{ing.name}</td>
                        <td className="px-4 py-3 text-right">R$ {Number(ing.price).toFixed(2).replace('.', ',')}</td>
                        <td className="px-4 py-3 text-right">{ing.qty}</td>
                        <td className="px-4 py-3 text-center">{ing.validity}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.cls}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredIngs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                        {ingredients.length === 0
                          ? 'Nenhum ingrediente cadastrado. Clique em "+ Novo" para começar.'
                          : 'Nenhum ingrediente encontrado para esta busca.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé com contagem */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              {ingredients.length} ingrediente(s) cadastrado(s)
            </div>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          Modal de Cliente
      ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.open && modal.mode === 'client'}
        onClose={closeModal}
        className="w-[780px]"
      >
        <div className="p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">
            {modal.isNew ? 'Novo Cliente' : 'Editar Cliente'}
          </h2>

          <div className="flex gap-6 mb-5">
            {/* Avatar */}
            <div className="w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="col-span-1 flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Cliente:</label>
                <div className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm text-gray-500">
                  {clientForm.code}
                </div>
              </div>
              <CF label="Nome:"         value={clientForm.name}         onChange={v => setClientForm(f => ({...f, name: v}))}         className="col-span-2" />
              <CF label="CPF/CNPJ:"     value={clientForm.cpf}          onChange={v => setClientForm(f => ({...f, cpf: v}))} />
              <CF label="Nascimento:"   value={clientForm.birth}        onChange={v => setClientForm(f => ({...f, birth: v}))}        type="date" />
              <CF label="País:"         value={clientForm.country}      onChange={v => setClientForm(f => ({...f, country: v}))} />
              <CF label="E-mail:"       value={clientForm.email}        onChange={v => setClientForm(f => ({...f, email: v}))}        className="col-span-2" />
              <CF label="Tel.:"         value={clientForm.phone}        onChange={v => setClientForm(f => ({...f, phone: v}))} />
              <CF label="CEP:"          value={clientForm.cep}          onChange={v => setClientForm(f => ({...f, cep: v}))} />
              <CF label="Endereço:"     value={clientForm.address}      onChange={v => setClientForm(f => ({...f, address: v}))}      className="col-span-2" />
              <CF label="Bairro:"       value={clientForm.neighborhood} onChange={v => setClientForm(f => ({...f, neighborhood: v}))} />
              <CF label="Complemento:" value={clientForm.complement}   onChange={v => setClientForm(f => ({...f, complement: v}))}   className="col-span-2" />
              <CF label="Cidade:"       value={clientForm.city}         onChange={v => setClientForm(f => ({...f, city: v}))} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" shortcut="F9"  onClick={saveClient}>
              {modal.isNew ? 'Cadastrar' : 'Salvar'}
            </Button>
            {!modal.isNew && (
              <Button variant="red" size="lg" shortcut="F10" onClick={removeClient}>
                Excluir cliente
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          Modal de Ingrediente
      ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.open && modal.mode === 'ingredient'}
        onClose={closeModal}
        className="w-[680px]"
      >
        <div className="p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">
            {modal.isNew ? 'Novo Ingrediente' : 'Editar Ingrediente'}
          </h2>

          <div className="flex gap-5 mb-5">
            {/* Foto do ingrediente */}
            <div className="w-36 h-36 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300
                            flex items-center justify-center flex-shrink-0 cursor-pointer
                            hover:border-gold transition overflow-hidden">
              {ingForm.image
                ? <img src={ingForm.image} className="w-full h-full object-cover" alt="" />
                : (
                  <div className="text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Foto</span>
                  </div>
                )
              }
            </div>

            {/* Campos */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="col-span-1 flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Código:</label>
                <div className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 font-mono">
                  {modal.isNew ? '(automático)' : ingForm.code}
                </div>
              </div>

              <CF
                label="Descrição:"
                value={ingForm.name}
                onChange={v => setIngForm(f => ({...f, name: v}))}
              />

              <CF
                label="ICMS (%):"
                value={ingForm.icms}
                onChange={v => setIngForm(f => ({...f, icms: v}))}
                type="number"
              />

              <CF
                label="Qtde em estoque:"
                value={ingForm.qty}
                onChange={v => setIngForm(f => ({...f, qty: v}))}
                type="number"
              />

              <CF
                label="Preço de compra (R$):"
                value={ingForm.price}
                onChange={v => setIngForm(f => ({...f, price: v}))}
                type="number"
                className="col-span-2"
              />

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Validade:</label>
                <input
                  type="date"
                  value={ingForm.validity || ''}
                  onChange={e => setIngForm(f => ({...f, validity: e.target.value}))}
                  className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-gold w-full"
                />
                {ingForm.validity && (
                  <ValidityInfo isoDate={ingForm.validity} />
                )}
              </div>
            </div>
          </div>

          {/* Produtos que usam este ingrediente */}
          {!modal.isNew && (ingForm.products?.length > 0) && (
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Produtos que utilizam este ingrediente:</p>
              <div className="flex flex-wrap gap-1.5">
                {ingForm.products.map((p, i) => (
                  <span key={i} className="text-xs bg-brown/10 text-brown border border-brown/20 rounded-full px-2.5 py-0.5 font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preço destaque */}
          <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
            <span className="font-bold text-sm text-gray-700">PREÇO DE COMPRA:</span>
            <span className="font-bold text-xl text-red">
              R$ {parseFloat(String(ingForm.price || '0').replace(',', '.') || 0).toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" shortcut="F9"  onClick={saveIngredient}>
              {modal.isNew ? 'Cadastrar' : 'Salvar'}
            </Button>
            {!modal.isNew && (
              <Button variant="red" size="lg" shortcut="F10" onClick={removeIngredient}>
                Excluir ingrediente
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Helpers de componentes e funções puras ───────────────────────────────────

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

function ValidityInfo({ isoDate }) {
  if (!isoDate) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const vDate = new Date(isoDate)
  const diff  = Math.round((vDate - today) / 86400000)
  const cls   = diff < 0 ? 'text-red' : diff <= 7 ? 'text-amber-600' : 'text-green'
  const msg   = diff < 0
    ? `Vencido há ${Math.abs(diff)} dia(s)`
    : `Vence em ${diff} dia(s)`
  return <p className={`text-xs font-semibold mt-0.5 ${cls}`}>{msg}</p>
}

function validityStatus(validity) {
  if (!validity) return { label: 'Sem data', cls: 'bg-gray-100 text-gray-500' }
  const today = new Date(); today.setHours(0,0,0,0)
  const [d, m, y] = validity.split('/')
  const vDate = new Date(Number(y), Number(m) - 1, Number(d))
  const diff  = Math.round((vDate - today) / 86400000)
  if (diff < 0)    return { label: 'Vencido',  cls: 'bg-red/10 text-red' }
  if (diff <= 7)   return { label: `${diff}d`,  cls: 'bg-amber-100 text-amber-700' }
  if (diff <= 30)  return { label: 'Próximo',   cls: 'bg-yellow-100 text-yellow-700' }
  return               { label: 'OK',           cls: 'bg-green/10 text-green' }
}
