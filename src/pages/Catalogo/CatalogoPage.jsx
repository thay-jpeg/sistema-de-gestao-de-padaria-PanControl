import { useState, useRef }  from 'react'
import { useNavigate }       from 'react-router-dom'
import Header                from '@/components/layout/Header'
import ProductCard           from '@/components/pdv/ProductCard'
import Button                from '@/components/ui/Button'
import Modal                 from '@/components/ui/Modal'
import { PRODUCTS, getProductByCode } from '@/mocks/data/products'
import { useAuth }           from '@/context/AuthContext'
import { canAccess }         from '@/config/permissions'
import useKeyboardShortcut   from '@/hooks/useKeyboardShortcut'

const EMPTY_PRODUCT = {
  code: '', name: '', price: '', cost: '', icms: '', qty: '', validity: '',
  ingredients: [], recipe: '', image: null,
}

export default function CatalogoPage() {
  const { user }          = useAuth()
  const [search,  setSearch]  = useState('')
  const [products, setProds]  = useState(PRODUCTS)
  const [selected, setSelected] = useState(null)
  const [modalOpen,setModal]   = useState(false)
  const [formData, setForm]    = useState(EMPTY_PRODUCT)
  const [isNew,    setIsNew]   = useState(false)

  const searchRef = useRef()
  const canEdit   = canAccess(user.role, 'gerenciamento') // só gestor cadastra

  function handleSearch() {
    const q = search.toLowerCase().trim()
    setProds(q ? PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.includes(q)
    ) : PRODUCTS)
  }

  function openProduct(product) {
    setSelected(product)
    setForm({ ...product, ingredients: [...(product.ingredients || [])] })
    setIsNew(false)
    setModal(true)
  }

  function openNew() {
    setSelected(null)
    setForm({ ...EMPTY_PRODUCT })
    setIsNew(true)
    setModal(true)
  }

  function saveProduct() {
    alert(isNew ? 'Produto cadastrado! (mock)' : 'Produto salvo! (mock)')
    setModal(false)
  }

  function deleteProduct() {
    if (!confirm('Deseja excluir este produto?')) return
    setProds(prev => prev.filter(p => p.code !== selected?.code))
    setModal(false)
  }

  useKeyboardShortcut([
    { key: 'F9',  fn: saveProduct },
    { key: 'F10', fn: deleteProduct },
    { key: 'c',   fn: () => canEdit && openNew() },
    { key: 'C',   fn: () => canEdit && openNew() },
    { key: 'p',   fn: () => searchRef.current?.focus() },
    { key: 'P',   fn: () => searchRef.current?.focus() },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Catálogo" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        {/* Barra de busca */}
        <div className="flex gap-3">
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Digite o nome do produto que esteja buscando..."
            className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button variant="gold" onClick={handleSearch}>(P)rocurar</Button>
          {canEdit && (
            <Button variant="green" onClick={openNew}>(C)adastrar +</Button>
          )}
        </div>

        {/* Grid de produtos */}
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto pan-scroll">
          <div className="flex flex-wrap gap-4">
            {products.map(p => (
              <ProductCard
                key={p.code}
                product={p}
                size="lg"
                onClick={openProduct}
              />
            ))}
            {products.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum produto encontrado.</p>
            )}
          </div>
        </div>
      </main>

      {/* Modal de detalhe/cadastro */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[840px] max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Linha 1: imagem + campos */}
          <div className="flex gap-6 mb-5">
            {/* Foto */}
            <div className="w-44 h-36 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {formData.image
                ? <img src={formData.image} className="w-full h-full object-cover" alt="" />
                : <span className="text-gray-300 text-xs">Foto</span>
              }
            </div>

            {/* Campos */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <FormField label="Código:"      value={formData.code}     onChange={v => setForm(f => ({...f, code: v}))}      disabled />
              <FormField label="Descrição:"   value={formData.name}     onChange={v => setForm(f => ({...f, name: v}))}      className="col-span-1" />
              <FormField label="ICMS (%):"    value={formData.icms}     onChange={v => setForm(f => ({...f, icms: v}))}      />
              <FormField label="Qtde:"        value={formData.qty}      onChange={v => setForm(f => ({...f, qty: v}))}       />
              <FormField label="Validade:"    value={formData.validity} onChange={v => setForm(f => ({...f, validity: v}))}  />
              <FormField label="Ingrediente(s):" value={formData.ingredients?.join(', ')} onChange={v => setForm(f => ({...f, ingredients: v.split(', ')}))} className="col-span-2" />
              <FormField label="Receita:"     value={formData.recipe}   onChange={v => setForm(f => ({...f, recipe: v}))}    className="col-span-2" />
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col gap-2 ml-2">
              <Button variant="green" onClick={saveProduct}>Salvar</Button>
              {!isNew && <Button variant="red" onClick={deleteProduct}>Excluir</Button>}
              <Button variant="brown" onClick={() => {}}>Alterar</Button>
            </div>
          </div>

          {/* Lista de ingredientes */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="font-bold mb-2 text-sm">Lista de ingredientes:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px] text-sm text-gray-700 pan-scroll overflow-y-auto max-h-44">
                {(formData.ingredients || []).map((ing, i) => (
                  <p key={i}>- {ing}</p>
                ))}
              </div>
            </div>

            {/* Custos */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold text-sm mb-1">CUSTO PRODUÇÃO:</p>
                <div className="border border-gray-200 rounded-lg p-3 text-red font-bold text-xl">
                  R$ {parseFloat(formData.cost || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mb-1">PREÇO VENDA:</p>
                <div className="border border-gray-200 rounded-lg p-3 text-green font-bold text-xl">
                  R$ {parseFloat(formData.price || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>

              <Button variant="green"  size="lg" shortcut="F9"  onClick={saveProduct}>Cadastrar</Button>
              {!isNew && <Button variant="red" size="lg" shortcut="F10" onClick={deleteProduct}>Excluir produto</Button>}
            </div>
          </div>

          {/* Receita */}
          <div className="mt-5">
            <p className="font-bold mb-2 text-sm">Receita:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line pan-scroll overflow-y-auto max-h-40">
              {formData.recipe || 'Sem receita cadastrada.'}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function FormField({ label, value, onChange, disabled, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 w-full"
      />
    </div>
  )
}
