import { useState, useRef, useMemo, useEffect } from 'react'
import Header from '@/components/layout/Header'
import ProductCard from '@/components/pdv/ProductCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { canAccess } from '@/config/permissions'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'
import api from '@/services/api'

const EMPTY = {
  idProduto: '', nomeProduto: '', codigoBarras: '', percentualICMS: 7,
  diasValidadePadrao: 3, percentualLucroBalcao: 100, percentualLucroAtacado: 60,
  precoBalcao: '', precoAtacado: '', quantidadeEstoque: 0,
  fichasTecnica: [], textoReceita: '', image: null,
}

export default function CatalogoPage() {
  const { user } = useAuth()

  const userRole = user?.perfil || '';
  const isGestor = userRole === 'GESTOR';
  const isProdutor = userRole === 'PRODUTOR';
  const isAtendente = userRole === 'ATENDENTE';

  const podeEditarBasico = isGestor || isProdutor;
  const podeEditarFinanceiro = isGestor;

  const [hasHistory, setHasHistory] = useState(false);

  // Estados para as listas do banco de dados
  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [isNew, setIsNew] = useState(false)
  const [ingFilter, setIngFilter] = useState('')
  const searchRef = useRef()

  // Busca os dados da API
  useEffect(() => {
    api.get('/produtos').then(res => setProducts(res.data)).catch(console.error);
    api.get('/ingredientes').then(res => setIngredients(res.data)).catch(console.error);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    const rawList = q ? products.filter(p =>
      p.nomeProduto.toLowerCase().includes(q) || String(p.codigoBarras).includes(q)
    ) : products;

    return rawList.map(p => ({
      ...p,
      id: p.idProduto,
      name: p.nomeProduto,
      price: p.precoBalcao,
      image: p.imagem
    }));
  }, [search, products])

  const filteredIngs = useMemo(() => {
    const q = ingFilter.toLowerCase().trim()
    return q ? ingredients.filter(i =>
      i.nomeIngrediente.toLowerCase().includes(q) || String(i.idIngrediente).includes(q)
    ) : ingredients
  }, [ingFilter, ingredients])

  const custoCalc = useMemo(() => {
    const fichas = form.fichasTecnica || [];
    return fichas.reduce((acc, item) => {
      const ing = ingredients.find(i => String(i.idIngrediente) === String(item.ingredienteId));
      const custo = ing ? parseFloat(ing.custoMedioUnitario || 0) : 0;
      return acc + (custo * (parseFloat(item.quantidade) || 0));
    }, 0);
  }, [form.fichasTecnica, ingredients])

  const validadeCalc = useMemo(() => {
    return null;
  }, [form.fichasTecnica, form.diasValidadePadrao])

  useEffect(() => {
    if (custoCalc > 0) {
      const icms = parseFloat(form.percentualICMS) || 0;
      const lucroB = parseFloat(form.percentualLucroBalcao) || 0;
      const lucroA = parseFloat(form.percentualLucroAtacado) || 0;

      // custo + ICMS + lucro
      const precoBaseB = custoCalc * (1 + (icms / 100)) * (1 + (lucroB / 100));
      const precoBaseA = custoCalc * (1 + (icms / 100)) * (1 + (lucroA / 100));

      const finalB = Math.floor(precoBaseB) + 0.90;
      const finalA = Math.floor(precoBaseA) + 0.90;

      if (form.precoBalcao !== finalB || form.precoAtacado !== finalA) {
        setForm(f => ({ ...f, precoBalcao: finalB, precoAtacado: finalA }));
      }
    }
  }, [custoCalc, form.percentualICMS, form.percentualLucroBalcao, form.percentualLucroAtacado]);

  // Abre modais
  async function openProduct(product) {
    setSelected(product)
    setIsNew(false); setIngFilter('');

    try {
      const resFicha = await api.get(`/fichastecnicas/produto/${product.idProduto}`);
      const fichasFormatadas = resFicha.data.map(f => ({
        idFichaTecnica: f.idFichaTecnica,
        ingredienteId: f.idIngrediente,
        quantidade: f.quantidadeNecessaria
      }));
      const texto = resFicha.data.length > 0 ? resFicha.data[0].textoReceita : '';
      setForm({ ...product, fichasTecnica: fichasFormatadas, textoReceita: texto });

      const resProd = await api.get(`/producao/produto/${product.idProduto}`);
      setHasHistory(resProd.data && resProd.data.length > 0);

    } catch (e) {
      setForm({ ...product, fichasTecnica: [], textoReceita: '' });
      setHasHistory(false);
    }
    setModal(true)
  }

  // ── FichaTécnica helpers ──────────────────────────────────────────────────
  function toggleIngrediente(ingId) {
    setForm(f => {
      const exists = (f.fichasTecnica || []).find(x => x.ingredienteId === ingId)
      if (exists) return { ...f, fichasTecnica: f.fichasTecnica.filter(x => x.ingredienteId !== ingId) }
      return { ...f, fichasTecnica: [...(f.fichasTecnica || []), { ingredienteId: ingId, quantidade: 1 }] }
    })
  }

  function setQtdFicha(ingId, qty) {
    setForm(f => ({
      ...f,
      fichasTecnica: (f.fichasTecnica || []).map(x =>
        x.ingredienteId === ingId ? { ...x, quantidade: parseFloat(qty) || 0 } : x
      ),
    }))
  }

  // CRUD
  async function saveProduct() {
    const payload = {
      nomeProduto: form.nomeProduto,
      codigoBarras: form.codigoBarras,
      percentualICMS: Number(form.percentualICMS),
      diasValidadePadrao: Number(form.diasValidadePadrao),
      percentualLucroBalcao: Number(form.percentualLucroBalcao),
      percentualLucroAtacado: Number(form.percentualLucroAtacado),
      precoBalcao: Number(form.precoBalcao),
      precoAtacado: Number(form.precoAtacado),
      quantidadeEstoque: Number(form.quantidadeEstoque) || 0,
      imagem: form.imagem
    };

    try {
      let produtoIdSalvo = null;

      if (isNew) {
        const res = await api.post('/produtos', payload);
        produtoIdSalvo = res.data.idProduto;
        setProducts([...products, res.data]);
      } else {
        const res = await api.put(`/produtos/${selected.idProduto}`, payload);
        produtoIdSalvo = res.data.idProduto;
        setProducts(products.map(p => p.idProduto === selected.idProduto ? res.data : p));
      }

      if (!isNew) {
        const fichasAntigas = await api.get(`/fichastecnicas/produto/${produtoIdSalvo}`).catch(() => ({ data: [] }));
        for (let f of (fichasAntigas.data || [])) {
          await api.delete(`/fichastecnicas/${f.idFichaTecnica}`);
        }
      }

      for (let item of (form.fichasTecnica || [])) {
        await api.post('/fichastecnicas', {
          idProduto: produtoIdSalvo,
          idIngrediente: item.ingredienteId,
          quantidadeNecessaria: parseFloat(item.quantidade),
          textoReceita: form.textoReceita || ''
        });
      }

      alert("Produto e Ficha Técnica salvos com sucesso!");
      setModal(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar o produto no sistema.");
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir produto definitivamente?')) return
    try {
      const fichasAntigas = await api.get(`/fichastecnicas/produto/${selected.idProduto}`).catch(() => ({ data: [] }));
      for (let f of (fichasAntigas.data || [])) {
        await api.delete(`/fichastecnicas/${f.idFichaTecnica}`);
      }

      await api.delete(`/produtos/${selected.idProduto}`);
      setProducts(products.filter(p => p.idProduto !== selected.idProduto));
      setModal(false);
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir. O produto possui histórico de Produção e não pode ser apagado.");
    }
  }
  function openNew() {
    setSelected(null);
    setForm({ ...EMPTY });
    setIsNew(true);
    setIngFilter('');
    setModal(true);
  }

  useKeyboardShortcut([
    { key: 'F9', fn: () => modalOpen ? saveProduct() : null },
    { key: 'F10', fn: () => modalOpen && !isNew ? handleDelete() : null },
    { key: 'c', fn: () => !modalOpen && podeEditarBasico && openNew() },
    { key: 'C', fn: () => !modalOpen && podeEditarBasico && openNew() },
    { key: 'p', fn: () => !modalOpen && searchRef.current?.focus() },
    { key: 'P', fn: () => !modalOpen && searchRef.current?.focus() },
  ])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Catálogo" showBack />

      <main className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex gap-3">
          <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
          <Button variant="gold">(P)rocurar</Button>
          {podeEditarBasico && <Button variant="green" onClick={openNew}>(C)adastrar +</Button>}
        </div>

        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto pan-scroll">
          <div className="flex flex-wrap gap-4">
            {filteredProducts.map(p => (
              <ProductCard key={p.idProduto} product={p} size="lg" onClick={openProduct} />
            ))}
            {filteredProducts.length === 0 && <p className="text-gray-400 text-sm">Nenhum produto encontrado.</p>}
          </div>
        </div>
      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} className="w-[980px] max-h-[94vh] overflow-y-auto pan-scroll">
        <div className="p-6 flex flex-col gap-5">

          {/* Título */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-800">
              {isNew ? 'Novo Produto' : isAtendente ? 'Visualizar Produto' : 'Editar Produto'}
            </h2>
            <div className="flex gap-2">
              {podeEditarBasico && <Button variant="green" shortcut="F9" onClick={saveProduct}>{isNew ? 'Cadastrar' : 'Salvar'}</Button>}
              {!isNew && isGestor && !hasHistory && <Button variant="red" shortcut="F10" onClick={handleDelete}>Excluir</Button>}
            </div>
          </div>

          {/* Linha 1 — foto + campos básicos */}
          <div className="flex gap-5">
            <label className="w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg
                            flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:border-gold transition relative">
              <input type="file" accept="image/*" className="hidden" disabled={!podeEditarBasico} onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setForm(f => ({ ...f, imagem: reader.result }));
                  reader.readAsDataURL(file);
                }
              }} />
              {form.imagem
                ? <img src={form.imagem} className="w-full h-full object-cover" alt="" />
                : <span className="text-gray-400 text-xs text-center px-2">Clique para adicionar<br />Foto do produto</span>}
            </label>

            <div className="flex-1 grid grid-cols-4 gap-3">
              <FF label="Código" value={form.idProduto} disabled={true} className="col-span-1" />
              <FF label="Descrição" value={form.nomeProduto} disabled={!podeEditarBasico} onChange={v => setForm(f => ({ ...f, nomeProduto: v }))} className="col-span-2" />

              <FF label="Cód. de Barras" value={form.codigoBarras} disabled={!podeEditarBasico}
                onChange={v => setForm(f => ({ ...f, codigoBarras: v.replace(/\D/g, '').slice(0, 5) }))} className="col-span-1" />

              <FF label="ICMS (%)" value={form.percentualICMS} disabled={!podeEditarFinanceiro} onChange={v => setForm(f => ({ ...f, percentualICMS: v }))} type="number" />
              <FF label="Dias Validade" value={form.diasValidadePadrao} disabled={!podeEditarBasico} onChange={v => setForm(f => ({ ...f, diasValidadePadrao: v }))} type="number" />

              <FF label="Qtde Estoque" value={form.quantidadeEstoque} disabled={true} type="number" />

              <div className="col-span-1" />
              <FF label="% Lucro Balcão" value={form.percentualLucroBalcao} disabled={!podeEditarFinanceiro} onChange={v => setForm(f => ({ ...f, percentualLucroBalcao: v }))} type="number" />
              <FF label="Preço Balcão (R$)" value={form.precoBalcao} disabled={!podeEditarFinanceiro} onChange={v => setForm(f => ({ ...f, precoBalcao: v }))} type="number" />
              <FF label="% Lucro Atacado" value={form.percentualLucroAtacado} disabled={!podeEditarFinanceiro} onChange={v => setForm(f => ({ ...f, percentualLucroAtacado: v }))} type="number" />
              <FF label="Preço Atacado (R$)" value={form.precoAtacado} disabled={!podeEditarFinanceiro} onChange={v => setForm(f => ({ ...f, precoAtacado: v }))} type="number" />
            </div>
          </div>

          {/* Ficha técnica + custos */}
          <div className="grid grid-cols-2 gap-5">

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">Ficha Técnica — Ingredientes:</p>
                <span className="text-xs text-gray-400">{(form.fichasTecnica || []).length} ingrediente(s)</span>
              </div>
              <input value={ingFilter} onChange={e => setIngFilter(e.target.value)}
                placeholder="Filtrar ingredientes..."
                className="bg-input-bg border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold" />

              {ingredients.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-sm text-amber-700">
                  Sem ingredientes cadastrados.<br />
                  <span className="text-xs">Vá em <b>Gerenciamento → Ingredientes</b></span>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-y-auto pan-scroll max-h-[240px] divide-y divide-gray-100">
                  {filteredIngs.map(ing => {
                    const fichaItem = (form.fichasTecnica || []).find(x => String(x.ingredienteId) === String(ing.idIngrediente))
                    const isSel = Boolean(fichaItem)

                    return (
                      <div key={ing.idIngrediente}
                        className={`flex items-center gap-2 px-3 py-2 transition ${isSel ? 'bg-green/10 border-l-4 border-green' : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'}`}>
                        <button type="button" disabled={isAtendente} onClick={() => !isAtendente && toggleIngrediente(ing.idIngrediente)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                            ${isSel ? 'bg-green border-green' : 'border-gray-300'}`}>
                          {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </button>

                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleIngrediente(ing.idIngrediente)}>
                          <p className="text-xs font-semibold text-gray-800 truncate">{ing.nomeIngrediente}</p>
                          <p className="text-[10px] text-gray-400">{ing.unidadeMedida} · cMed: R${Number(ing.custoMedioUnitario || 0).toFixed(2).replace('.', ',')}</p>
                        </div>

                        {isSel && (
                          <input disabled={isAtendente}
                            type="number" min="0" step="any"
                            value={fichaItem.quantidade}
                            onChange={e => setQtdFicha(ing.idIngrediente, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="w-16 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold text-right"
                          />
                        )}
                        {isSel && <span className="text-[10px] text-gray-400 w-6">{ing.unidadeMedida}</span>}
                      </div>
                    )
                  })}
                  {filteredIngs.length === 0 && <p className="text-center text-gray-400 text-xs py-4">Nenhum ingrediente encontrado.</p>}
                </div>
              )}
            </div>

            {/* Direita: chips selecionados + custo + validade */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold text-sm mb-1">Ingredientes selecionados:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px] max-h-[120px] overflow-y-auto pan-scroll">
                  {(form.fichasTecnica || []).length === 0
                    ? <p className="text-gray-400 text-xs text-center mt-3">← Selecione ingredientes</p>
                    : <div className="flex flex-wrap gap-1.5">
                      {(form.fichasTecnica || []).map(f => {
                        const ing = ingredients.find(i => String(i.idIngrediente) === String(f.ingredienteId))
                        if (!ing) return null

                        return (
                          <span key={f.ingredienteId}
                            className="inline-flex items-center gap-1 bg-green/10 text-green border border-green/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                            {ing.nomeIngrediente} <span className="text-gray-500 font-normal">({f.quantidade} {ing.unidadeMedida})</span>
                            {!isAtendente && (
                              <button onClick={() => toggleIngrediente(f.ingredienteId)} className="text-green/60 hover:text-red ml-0.5 font-bold">×</button>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  }
                </div>
              </div>

              {/* Custo de produção calculado */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">CUSTO DE PRODUÇÃO (calculado):</p>
                <p className="text-2xl font-bold text-red">R$ {custoCalc.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Baseado no custo médio unitário de cada ingrediente.</p>
              </div>

              {/* Validade estimada */}
              <ValidityBanner validity={validadeCalc} dias={form.diasValidadePadrao} />
            </div>
          </div>

          {/* Linha 3 — receita */}
          <div>
            <p className="font-bold text-sm mb-1">Receita / Modo de Preparo <span className="text-xs text-gray-400 font-normal">(textoReceita — fichasTecnicas)</span>:</p>
            <textarea disabled={isAtendente} value={form.textoReceita || ''} onChange={e => setForm(f => ({ ...f, textoReceita: e.target.value }))}
              rows={4} placeholder="Descreva o modo de preparo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold resize-none pan-scroll" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function FF({ label, value, onChange, disabled, type = 'text', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)} disabled={disabled}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 w-full" />
    </div>
  )
}

function ValidityBadge({ validity }) {
  if (!validity) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [d, m, y] = validity.split('/')
  const diff = Math.round((new Date(Number(y), Number(m) - 1, Number(d)) - today) / 86400000)
  const cls = diff < 0 ? 'bg-red/10 text-red border-red/20'
    : diff <= 7 ? 'bg-amber-50 text-amber-600 border-amber-200'
      : 'bg-green/10 text-green border-green/20'
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${cls}`}>{validity}</span>
}

function ValidityBanner({ validity, dias }) {
  if (!validity && !dias) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [d, m, y] = (validity || '').split('/')
  const vDate = validity ? new Date(Number(y), Number(m) - 1, Number(d)) : null
  const diff = vDate ? Math.round((vDate - today) / 86400000) : null
  const isExp = diff !== null && diff < 0
  const isWarn = diff !== null && diff >= 0 && diff <= 7

  return (
    <div className={`rounded-lg px-4 py-2.5 text-xs font-semibold border flex items-start gap-2
      ${isExp ? 'bg-red/10 border-red/30 text-red' : isWarn ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-green/10 border-green/30 text-green'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div>
        <p>{validity ? `Validade estimada do lote: ${validity}` : `${dias} dia(s) de validade padrão.`}</p>
        {validity && <p className="opacity-70 mt-0.5">Determinada pelo menor prazo entre os {dias} dias padrão e os lotes de ingredientes.</p>}
      </div>
    </div>
  )
}
