import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useData, isoToBR, brToISO } from '@/context/DataContext'
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut'
import api from '@/services/api'

const maskCPFCNPJ = (v, tipoPessoa) => {
  if (!v) return "";
  v = v.replace(/\D/g, "");

  if (tipoPessoa === 'PF') {
    v = v.slice(0, 11); // em 11 dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    v = v.slice(0, 14); // em 14 dígitos
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return v;
};

const TABS = [
  { key: 'clientes', label: 'Clientes' },
  { key: 'usuarios', label: 'Usuários' },
  { key: 'ingredientes', label: 'Ingredientes' },
]
const ING_SUB_TABS = [
  { key: 'lista', label: 'Lista de Ingredientes' },
  { key: 'compras', label: 'Compras / Entradas' },
]

const EMPTY_CLIENT = { code: '', name: '', cpf: '', birth: '', country: 'Brasil', email: '', phone: '', cep: '', address: '', neighborhood: '', city: '', complement: '', tipoPessoa: 'PF', ativo: true, uf: '', numero: '' }
const EMPTY_ING = { name: '', unidadeMedida: '', quantidadeEstoque: '', estoqueMinimo: '', custoMedioUnitario: '', image: null }
const EMPTY_COMPRA = { ingredienteId: '', quantidadeComprada: '', dataValidade: '', custoTotal: '', dataCompra: '' }
const EMPTY_USER = { nomeUsuario: '', codigoAcesso: '', senhaHash: '', perfil: 'ATENDENTE', statusAtivo: true };

export default function GerenciamentoPage() {
  const {
    ingredients, addIngredient, updateIngredient, deleteIngredient,
    compras, addCompra, deleteCompra,
    clients, addClient, updateClient, deleteClient,
    todayBR,
  } = useData()

  const [tab, setTab] = useState('clientes')
  const [ingSubTab, setIngSub] = useState('lista')
  const [ingSearch, setIngSearch] = useState('')
  const [compSearch, setCompSearch] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [userForm, setUF] = useState(EMPTY_USER);
  const [selUser, setSelU] = useState(null);
  const [clientes, setClientes] = useState([]);

  // Busca os usuários na API
  useEffect(() => {
    if (tab === 'usuarios') {
      api.get('/usuarios')
        .then(response => {
          setUsuarios(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar usuários:", error);
        });
    }
  }, [tab]);

  // Busca os clientes na API
  useEffect(() => {
    if (tab === 'clientes') {
      api.get('/clientes')
        .then(response => {
          setClientes(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar clientes:", error);
        });
    }
  }, [tab]);

  const maskPhone = (v) => {
    if (!v) return "";
    v = v.replace(/\D/g, "");
    // Telefone: (00) 00000-0000
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v.slice(0, 15);
  };

  // modal unificado
  const [modal, setModal] = useState({ open: false, mode: 'client', isNew: true })
  const [clientForm, setCF] = useState(EMPTY_CLIENT)
  const [ingForm, setIF] = useState(EMPTY_ING)
  const [compraForm, setCompF] = useState(EMPTY_COMPRA)
  const [selClient, setSelC] = useState(null)
  const [selIng, setSelI] = useState(null)
  const [selCompra, setSelCo] = useState(null)

  const closeModal = () => setModal(m => ({ ...m, open: false }))

  // ── Ingredientes filtrados ────────────────────────────────────────────────
  const filteredIngs = useMemo(() => {
    const q = ingSearch.toLowerCase().trim()
    return q ? ingredients.filter(i => i.name.toLowerCase().includes(q) || i.code.includes(q)) : ingredients
  }, [ingredients, ingSearch])

  // ── Compras filtradas ─────────────────────────────────────────────────────
  const filteredCompras = useMemo(() => {
    const q = compSearch.toLowerCase().trim()
    return compras.filter(c => {
      const ing = ingredients.find(i => i.id === c.ingredienteId)
      if (!q) return true
      return ing?.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    }).map(c => ({
      ...c,
      nomeIngrediente: ingredients.find(i => i.id === c.ingredienteId)?.name || '?',
    }))
  }, [compras, compSearch, ingredients])

  // ── Custo unitário calculado ao digitar ───────────────────────────────────
  const custoUnitCalc = useMemo(() => {
    const tot = parseFloat(compraForm.custoTotal) || 0
    const qty = parseFloat(compraForm.quantidadeComprada) || 0
    return qty > 0 ? tot / qty : 0
  }, [compraForm.custoTotal, compraForm.quantidadeComprada])

  // ── Abre modais ───────────────────────────────────────────────────────────
  function openNewClient() { setSelC(null); setCF({ ...EMPTY_CLIENT, code: `0000${String(clients.length + 41).padStart(4, '0')}` }); setModal({ open: true, mode: 'client', isNew: true }) }
  async function openEditClient(c) {
    setSelC(c);

    let formPreenchido = {
      ...EMPTY_CLIENT,
      name: c.nomeRazaoSocial,
      cpf: maskCPFCNPJ(c.documentoCliente),
      tipoPessoa: c.tipoPessoa === 'J' ? 'PJ' : 'PF',
      birth: c.dataNascimento || '',
      ativo: c.ativo
    };

    // Abre o modal imediatamente
    setModal({ open: true, mode: 'client', isNew: false });

    try {
      // Busca o endereço do cliente
      const res = await api.get(`/enderecos/cliente/${c.idClienteAtacadista}`);
      const end = res.data;

      const nomeRuaCompleto = end.logradouro ? `${end.logradouro.tipoLogradouro.nomeTipoLogradouro} ${end.logradouro.nomeLogradouro}` : '';

      // Atualiza o modal com os dados de endereço
      formPreenchido = {
        ...formPreenchido,
        cep: end.cep || '',
        uf: end.cidade?.uf?.siglaUF || '',
        city: end.cidade?.nomeCidade || '',
        address: nomeRuaCompleto,
        numero: end.numeroEnd || '',
        neighborhood: end.bairro?.nomeBairro || '',
        complement: end.complementoEnd || ''
      };
    } catch (error) {
      console.log("Este cliente ainda não possui um endereço salvo no banco.");
    }

    try {
      const resEmail = await api.get(`/contatos/email/${c.idClienteAtacadista}`);
      formPreenchido.email = resEmail.data;
    } catch (e) { }

    try {
      const resFone = await api.get(`/contatos/telefone/${c.idClienteAtacadista}`);
      formPreenchido.phone = maskPhone(resFone.data);
    } catch (e) { }

    setCF(formPreenchido);
  }
  function openNewIng() { setSelI(null); setIF({ ...EMPTY_ING }); setModal({ open: true, mode: 'ingredient', isNew: true }) }
  function openEditIng(i) { setSelI(i); setIF({ ...i, validity: brToISO(i.validity) }); setModal({ open: true, mode: 'ingredient', isNew: false }) }
  function openNewCompra() { setSelCo(null); setCompF({ ...EMPTY_COMPRA, dataCompra: brToISO(todayBR()) }); setModal({ open: true, mode: 'compra', isNew: true }) }
  function openNewUser() {
    setUF({ ...EMPTY_USER });
    setModal({ open: true, mode: 'user', isNew: true });
  }
  function openEditUser(u) {
    setSelU(u);
    setUF({ ...u, senhaHash: '' });
    setModal({ open: true, mode: 'user', isNew: false });
  }

  // ── Salva / exclui ────────────────────────────────────────────────────────
  async function saveClient() {
    try {
      // Monta o pacote de dados do Cliente
      const clientePayload = {
        nomeRazaoSocial: clientForm.name,
        tipoPessoa: clientForm.tipoPessoa === 'PJ' ? 'J' : 'F',
        documentoCliente: clientForm.cpf,

        dataNascimento: clientForm.birth ? clientForm.birth : null,
        ativo: clientForm.ativo
      };

      let clienteSalvo;

      if (modal.isNew) {
        // Envia o POST 
        const resCliente = await api.post('/clientes', clientePayload);
        clienteSalvo = resCliente.data;
      } else {
        // Envia o PUT para atualizar
        const resCliente = await api.put(`/clientes/${selClient.idClienteAtacadista}`, clientePayload);
        clienteSalvo = resCliente.data;
      }
      const partesEndereco = (clientForm.address || '').trim().split(' ');
      const tipoLogradouro = partesEndereco.length > 1 ? partesEndereco[0] : 'Rua';
      const nomeLogradouro = partesEndereco.length > 1 ? partesEndereco.slice(1).join(' ') : clientForm.address;

      const enderecoPayload = {
        idCliente: clienteSalvo.idClienteAtacadista,
        cep: clientForm.cep,
        siglaUF: clientForm.uf,
        nomeCidade: clientForm.city,
        nomeBairro: clientForm.neighborhood,
        siglaTipoLogradouro: tipoLogradouro,
        nomeLogradouro: nomeLogradouro,
        numeroEnd: clientForm.numero,
        complementoEnd: clientForm.complement || ''
      };

      // Envia o POST para o Spring Boot
      await api.post('/enderecos', enderecoPayload);

      if (clientForm.email) {
        await api.post(`/contatos/email?idCliente=${clienteSalvo.idClienteAtacadista}&emailCompleto=${clientForm.email}`);
      }

      if (clientForm.phone) {
        await api.post(`/contatos/telefone?idCliente=${clienteSalvo.idClienteAtacadista}&telefoneCompleto=${clientForm.phone}`);
      }

      // Atualiza a tabela
      if (modal.isNew) {
        setClientes([...clientes, clienteSalvo]);
      } else {
        setClientes(clientes.map(c => c.idClienteAtacadista === clienteSalvo.idClienteAtacadista ? clienteSalvo : c));
      }

      closeModal();
      alert("Cliente e endereço salvos com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar cliente/endereço:", error);
      alert("Erro ao salvar. Verifique se o CPF/CNPJ já não está cadastrado.");
    }
  }
  async function removeClient() {
    if (!confirm('Excluir este cliente permanentemente?')) return;

    try {
      await api.delete(`/clientes/${selClient.idClienteAtacadista}`);
      setClientes(clientes.filter(c => c.idClienteAtacadista !== selClient.idClienteAtacadista));
      closeModal();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao excluir. O cliente pode ter endereços ou pedidos vinculados no sistema.");
    }
  }
  function saveIng() {
    const payload = {
      ...ingForm,
      quantidadeEstoque: parseFloat(ingForm.quantidadeEstoque) || 0,
      estoqueMinimo: parseFloat(ingForm.estoqueMinimo) || 0,
      custoMedioUnitario: parseFloat(ingForm.custoMedioUnitario) || 0,
    }
    if (modal.isNew) addIngredient(payload)
    else updateIngredient(selIng.id, payload)
    closeModal()
  }
  function removeIng() {
    if (!confirm('Excluir ingrediente? Ele será removido de todos os produtos.')) return
    deleteIngredient(selIng.id); closeModal()
  }
  function saveCompra() {
    if (!compraForm.ingredienteId) { alert('Selecione um ingrediente.'); return }
    const payload = {
      ...compraForm,
      quantidadeComprada: parseFloat(compraForm.quantidadeComprada) || 0,
      custoTotal: parseFloat(compraForm.custoTotal) || 0,
      dataValidade: isoToBR(compraForm.dataValidade),
      dataCompra: isoToBR(compraForm.dataCompra) || todayBR(),
      idUsuario: 'USR001',
    }
    addCompra(payload); closeModal()
  }
  function saveUser() {
    if (modal.isNew) {
      api.post('/usuarios', userForm)
        .then(response => {
          setUsuarios([...usuarios, response.data]);
          closeModal();
        })
        .catch(error => alert("Erro ao salvar. Verifique se o código já existe."));
    } else {
      api.put(`/usuarios/${selUser.idUsuario}`, userForm)
        .then(response => {
          setUsuarios(usuarios.map(u => u.idUsuario === selUser.idUsuario ? response.data : u));
          closeModal();
        })
        .catch(error => alert("Erro ao atualizar o usuário."));
    }
  }

  function removeUser() {
    if (!confirm('Excluir este usuário permanentemente?')) return;

    api.delete(`/usuarios/${selUser.idUsuario}`)
      .then(() => {
        setUsuarios(usuarios.filter(u => u.idUsuario !== selUser.idUsuario));
        closeModal();
      })
      .catch(error => {
        console.error("Erro ao deletar", error);
        alert("Erro ao excluir. Este usuário pode estar vinculado a alguma produção.");
      });
  }

  async function buscarCEP(cepDigitado) {

    const cepLimpo = cepDigitado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado. Verifique a digitação.");
        return;
      }

      // Preenche os campos automaticamente no formulário
      setCF(prev => ({
        ...prev,
        cep: data.cep,
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        uf: data.uf
      }));
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
    }
  }

  // ── Atalhos de teclado ────────────────────────────────────────────────────
  useKeyboardShortcut([
    {
      key: 'F9', fn: () => {
        if (!modal.open) {
          if (tab === 'clientes' && ingSubTab === 'lista') openNewClient()
          if (tab === 'ingredientes' && ingSubTab === 'lista') openNewIng()
          if (tab === 'ingredientes' && ingSubTab === 'compras') openNewCompra()
          if (tab === 'usuarios') openNewUser()
          return
        }
        if (modal.mode === 'client') saveClient()
        if (modal.mode === 'ingredient') saveIng()
        if (modal.mode === 'compra') saveCompra()
        if (modal.mode === 'user') saveUser();
      }
    },
    {
      key: 'F10', fn: () => {
        if (!modal.open || modal.isNew) return
        if (modal.mode === 'client') removeClient()
        if (modal.mode === 'ingredient') removeIng()
        if (modal.mode === 'user') removeUser()
      }
    },
  ])

  function handleNew() {
    if (tab === 'clientes') { openNewClient(); return }
    if (tab === 'usuarios') { openNewUser(); return; }
    if (tab === 'ingredientes') {
      if (ingSubTab === 'lista') { openNewIng(); return }
      if (ingSubTab === 'compras') { openNewCompra(); return }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Gerenciamento" showBack />

      <main className="flex-1 flex flex-col p-6 gap-0">
        {/* Abas principais */}
        <div className="flex items-end gap-1 border-b border-gray-200">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition border border-b-0 -mb-px
                ${tab === t.key ? 'bg-header text-white border-header z-10' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
          <div className="flex-1" />

          <Button variant="green" size="sm" onClick={handleNew} className="mb-1">+ Novo</Button>
        </div>

        {/* ── Clientes ──────────────────────────────────────────────────── */}
        {tab === 'clientes' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brown text-white">
                <tr>
                  {['Cód', 'Nome', 'CPF/CNPJ', 'Tipo', 'Cidade', 'Tel.', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientes.map((c, i) => (
                  <tr key={c.idClienteAtacadista} onClick={() => openEditClient(c)}
                    className={`cursor-pointer hover:bg-yellow-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-mono text-gray-500">{c.idClienteAtacadista}</td>
                    <td className="px-4 py-3 font-semibold">{c.nomeRazaoSocial}</td>

                    {/* Aplica a máscara */}
                    <td className="px-4 py-3">{maskCPFCNPJ(c.documentoCliente)}</td>

                    <td className="px-4 py-3">
                      {/* Converte o J/F do banco*/}
                      <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                        {c.tipoPessoa === 'J' ? 'PJ' : 'PF'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-400 italic text-xs">Via Endereço</td>
                    <td className="px-4 py-3 text-gray-400 italic text-xs">Via Contato</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.ativo !== false ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}>
                        {c.ativo !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      Carregando clientes ou nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Usuários ───────────────────────────────────────────────────── */}
        {tab === 'usuarios' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brown text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">ID</th>
                  <th className="px-4 py-3 text-left font-bold">Nome</th>
                  <th className="px-4 py-3 text-left font-bold">Código de Acesso</th>
                  <th className="px-4 py-3 text-left font-bold">Perfil</th>
                  <th className="px-4 py-3 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.idUsuario} onClick={() => openEditUser(u)} className={`cursor-pointer hover:bg-yellow-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-mono text-gray-500">{u.idUsuario}</td>
                    <td className="px-4 py-3 font-semibold">{u.nomeUsuario}</td>
                    <td className="px-4 py-3">{u.codigoAcesso}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 font-bold">
                        {u.perfil}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.statusAtivo ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}>
                        {u.statusAtivo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Carregando usuários ou nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Ingredientes ───────────────────────────────────────────────── */}
        {tab === 'ingredientes' && (
          <div className="border border-t-0 border-gray-200 rounded-b-lg flex flex-col">
            {/* sub-abas */}
            <div className="flex gap-1 px-3 pt-3 border-b border-gray-100 bg-gray-50">
              {ING_SUB_TABS.map(s => (
                <button key={s.key} onClick={() => setIngSub(s.key)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-t border border-b-0 transition
                    ${ingSubTab === s.key ? 'bg-white text-header border-gray-200' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* sub-aba: lista de ingredientes */}
            {ingSubTab === 'lista' && (
              <>
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <input value={ingSearch} onChange={e => setIngSearch(e.target.value)}
                    placeholder="Buscar ingrediente por nome ou código..."
                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div className="overflow-y-auto pan-scroll max-h-[500px]">
                  <table className="w-full text-sm">
                    <thead className="bg-brown text-white sticky top-0">
                      <tr>
                        {['Cód', 'Descrição', 'Unidade', 'Qtde Estoque', 'Estoque Mín.', 'Custo Médio Unit.', 'Status Estoque'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIngs.map((i, idx) => {
                        const baixo = i.quantidadeEstoque <= i.estoqueMinimo
                        return (
                          <tr key={i.id} onClick={() => openEditIng(i)}
                            className={`cursor-pointer hover:bg-yellow-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 font-mono text-gray-500">{i.code}</td>
                            <td className="px-4 py-3 font-semibold">{i.name}</td>
                            <td className="px-4 py-3">{i.unidadeMedida}</td>
                            <td className="px-4 py-3 text-right">{i.quantidadeEstoque}</td>
                            <td className="px-4 py-3 text-right">{i.estoqueMinimo}</td>
                            <td className="px-4 py-3 text-right">R$ {Number(i.custoMedioUnitario || 0).toFixed(4)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${baixo ? 'bg-red/10 text-red' : 'bg-green/10 text-green'}`}>
                                {baixo ? '⚠ Baixo' : 'OK'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                      {filteredIngs.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                          {ingredients.length === 0 ? 'Nenhum ingrediente. Clique em "+ Novo".' : 'Nenhum resultado.'}
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                  {ingredients.length} ingrediente(s) cadastrado(s)
                </div>
              </>
            )}

            {/* sub-aba: compras / entradas */}
            {ingSubTab === 'compras' && (
              <>
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <input value={compSearch} onChange={e => setCompSearch(e.target.value)}
                    placeholder="Buscar por ingrediente..."
                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div className="overflow-y-auto pan-scroll max-h-[500px]">
                  <table className="w-full text-sm">
                    <thead className="bg-brown text-white sticky top-0">
                      <tr>
                        {['ID', 'Ingrediente', 'Qtde Comprada', 'Qtde Restante', 'Data Compra', 'Validade Lote', 'Custo Total', 'Custo Unit.'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-bold text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompras.map((c, idx) => {
                        const today = new Date(); today.setHours(0, 0, 0, 0)
                        const [dd, mm, yy] = (c.dataValidade || '').split('/')
                        const vDate = c.dataValidade ? new Date(Number(yy), Number(mm) - 1, Number(dd)) : null
                        const diff = vDate ? Math.round((vDate - today) / 86400000) : null
                        const vCls = diff === null ? '' : diff < 0 ? 'text-red font-bold' : diff <= 7 ? 'text-amber-600 font-bold' : ''
                        return (
                          <tr key={c.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-2.5 font-mono text-gray-500 text-xs">{c.id}</td>
                            <td className="px-4 py-2.5 font-semibold">{c.nomeIngrediente}</td>
                            <td className="px-4 py-2.5 text-right">{c.quantidadeComprada}</td>
                            <td className="px-4 py-2.5 text-right">{c.quantidadeRestante}</td>
                            <td className="px-4 py-2.5">{c.dataCompra}</td>
                            <td className={`px-4 py-2.5 ${vCls}`}>{c.dataValidade}</td>
                            <td className="px-4 py-2.5 text-right">R$ {Number(c.custoTotal || 0).toFixed(2).replace('.', ',')}</td>
                            <td className="px-4 py-2.5 text-right">R$ {Number(c.custoUnitario || 0).toFixed(4)}</td>
                          </tr>
                        )
                      })}
                      {filteredCompras.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Nenhuma compra registrada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                  {compras.length} entrada(s) registrada(s)
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Modal Cliente ──────────────────────────────────────────────────── */}
      <Modal isOpen={modal.open && modal.mode === 'client'} onClose={closeModal} className="w-[800px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">{modal.isNew ? 'Novo Cliente' : 'Editar Cliente'}</h2>
          <div className="flex gap-5 mb-4">
            <div className="w-36 h-36 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="col-span-1 flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Tipo Pessoa</label>
                <select value={clientForm.tipoPessoa || 'PF'} onChange={e => setCF(f => ({ ...f, tipoPessoa: e.target.value }))}
                  className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="PF">PF — Física</option>
                  <option value="PJ">PJ — Jurídica</option>
                </select>
              </div>
              <CF label={clientForm.tipoPessoa === 'PJ' ? 'Razão Social:' : 'Nome:'} value={clientForm.name} onChange={v => setCF(f => ({ ...f, name: v }))} className="col-span-2" />
              <CF
                label={clientForm.tipoPessoa === 'PJ' ? 'CNPJ:' : 'CPF:'}
                value={clientForm.cpf}
                onChange={v => setCF(f => ({ ...f, cpf: v }))}
                maskType="cpfCnpj"
                tipoPessoa={clientForm.tipoPessoa}
                disabled={!modal.isNew}
              />
              <CF label="Nascimento:" value={clientForm.birth} onChange={v => setCF(f => ({ ...f, birth: v }))} type="date" />
              <CF label="País:" value={clientForm.country} onChange={v => setCF(f => ({ ...f, country: v }))} />
              <CF label="E-mail:" value={clientForm.email} onChange={v => setCF(f => ({ ...f, email: v }))} className="col-span-2" />
              <CF label="Tel.:" value={clientForm.phone} onChange={v => setCF(f => ({ ...f, phone: v }))} maskType="phone" />
              <CF label="CEP:" value={clientForm.cep} onChange={v => setCF(f => ({ ...f, cep: v }))} onBlur={() => buscarCEP(clientForm.cep)} />
              <CF label="UF:" value={clientForm.uf} onChange={v => setCF(f => ({ ...f, uf: v }))} />
              <CF label="Cidade:" value={clientForm.city} onChange={v => setCF(f => ({ ...f, city: v }))} />
              <CF label="Endereço (Rua/Av):" value={clientForm.address} onChange={v => setCF(f => ({ ...f, address: v }))} className="col-span-2" />
              <CF label="Número:" value={clientForm.numero} onChange={v => setCF(f => ({ ...f, numero: v }))} />
              <CF label="Bairro:" value={clientForm.neighborhood} onChange={v => setCF(f => ({ ...f, neighborhood: v }))} />
              <CF label="Complemento:" value={clientForm.complement} onChange={v => setCF(f => ({ ...f, complement: v }))} className="col-span-2" />
              <div className="col-span-3 flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Status:</label>
                <button onClick={() => setCF(f => ({ ...f, ativo: !f.ativo }))}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full border transition
                    ${clientForm.ativo !== false ? 'bg-green/10 text-green border-green/30' : 'bg-red/10 text-red border-red/30'}`}>
                  {clientForm.ativo !== false ? '✓ Ativo' : '✕ Inativo'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveClient}>{modal.isNew ? 'Cadastrar' : 'Salvar'}</Button>
            {!modal.isNew && <Button variant="red" size="lg" shortcut="F10" onClick={removeClient}>Excluir</Button>}
          </div>
        </div>
      </Modal>

      {/* ── Modal Usuário ──────────────────────────────────────────────────── */}
      <Modal isOpen={modal.open && modal.mode === 'user'} onClose={closeModal} className="w-[500px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">{modal.isNew ? 'Novo Usuário' : 'Editar Usuário'}</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <CF label="Nome:" value={userForm.nomeUsuario} onChange={v => setUF(f => ({ ...f, nomeUsuario: v }))} className="col-span-2" />
            <CF label="Cód. de Acesso:" value={userForm.codigoAcesso} onChange={v => setUF(f => ({ ...f, codigoAcesso: v }))} />
            <CF label="Senha:" value={userForm.senhaHash} onChange={v => setUF(f => ({ ...f, senhaHash: v }))} type="password" />

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Perfil</label>
              <select value={userForm.perfil} onChange={e => setUF(f => ({ ...f, perfil: e.target.value }))}
                className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="ATENDENTE">Atendente</option>
                <option value="PRODUTOR">Produtor</option>
                <option value="GESTOR">Gestor</option>
              </select>
            </div>

            <div className="col-span-2 flex items-center gap-3 mt-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Status:</label>
              <button onClick={() => setUF(f => ({ ...f, statusAtivo: !f.statusAtivo }))}
                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition
                  ${userForm.statusAtivo ? 'bg-green/10 text-green border-green/30' : 'bg-red/10 text-red border-red/30'}`}>
                {userForm.statusAtivo ? '✓ Ativo' : '✕ Inativo'}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveUser}>{modal.isNew ? 'Cadastrar' : 'Salvar'}</Button>
            {!modal.isNew && <Button variant="red" size="lg" shortcut="F10" onClick={removeUser}>Excluir</Button>}
          </div>
        </div>
      </Modal>

      {/* ── Modal Ingrediente ──────────────────────────────────────────────── */}
      <Modal isOpen={modal.open && modal.mode === 'ingredient'} onClose={closeModal} className="w-[600px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">{modal.isNew ? 'Novo Ingrediente' : 'Editar Ingrediente'}</h2>
          <div className="flex gap-5 mb-4">
            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-gold transition">
              <span className="text-gray-400 text-xs text-center">Foto</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              {!modal.isNew && (
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Código</label>
                  <div className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-500">{selIng?.code}</div>
                </div>
              )}
              <CF label="Descrição:" value={ingForm.name} onChange={v => setIF(f => ({ ...f, name: v }))} className="col-span-2" />
              <CF label="Unid. Medida:" value={ingForm.unidadeMedida} onChange={v => setIF(f => ({ ...f, unidadeMedida: v }))} />
              <CF label="Qtde Estoque:" value={ingForm.quantidadeEstoque} onChange={v => setIF(f => ({ ...f, quantidadeEstoque: v }))} type="number" />
              <CF label="Estoque Mínimo:" value={ingForm.estoqueMinimo} onChange={v => setIF(f => ({ ...f, estoqueMinimo: v }))} type="number" />
              <CF label="Custo Médio Unit.:" value={ingForm.custoMedioUnitario} onChange={v => setIF(f => ({ ...f, custoMedioUnitario: v }))} type="number" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">💡 A validade do ingrediente é registrada por lote em <b>Compras / Entradas</b>.</p>
          <div className="flex justify-end gap-3">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveIng}>{modal.isNew ? 'Cadastrar' : 'Salvar'}</Button>
            {!modal.isNew && <Button variant="red" size="lg" shortcut="F10" onClick={removeIng}>Excluir</Button>}
          </div>
        </div>
      </Modal>

      {/* ── Modal Nova Compra ──────────────────────────────────────────────── */}
      <Modal isOpen={modal.open && modal.mode === 'compra'} onClose={closeModal} className="w-[540px]">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-5">Nova Entrada de Ingrediente</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Ingrediente:</label>
              <select value={compraForm.ingredienteId} onChange={e => setCompF(f => ({ ...f, ingredienteId: e.target.value }))}
                className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="">Selecione...</option>
                {ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unidadeMedida})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CF label={`Qtde Comprada (${ingredients.find(i => i.id === compraForm.ingredienteId)?.unidadeMedida || 'un'}):`}
                value={compraForm.quantidadeComprada} onChange={v => setCompF(f => ({ ...f, quantidadeComprada: v }))} type="number" />
              <CF label="Custo Total (R$):" value={compraForm.custoTotal} onChange={v => setCompF(f => ({ ...f, custoTotal: v }))} type="number" />
              <CF label="Data da Compra:" value={compraForm.dataCompra} onChange={v => setCompF(f => ({ ...f, dataCompra: v }))} type="date" />
              <CF label="Validade do Lote:" value={compraForm.dataValidade} onChange={v => setCompF(f => ({ ...f, dataValidade: v }))} type="date" />
            </div>
            {custoUnitCalc > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Custo unitário calculado:</span>
                <span className="text-lg font-bold text-green">R$ {custoUnitCalc.toFixed(4)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="green" size="lg" shortcut="F9" onClick={saveCompra}>Registrar Entrada</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function CF({ label, value, onChange, onBlur, type = 'text', className = '', maskType, disabled = false, tipoPessoa = 'PF' }) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (maskType === 'cpfCnpj') val = maskCPFCNPJ(val, tipoPessoa);
    if (maskType === 'phone') val = maskPhone(val);
    onChange?.(val);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input
        type={type} value={value ?? ''} onChange={handleChange} onBlur={onBlur} disabled={disabled}
        className={`border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold w-full 
          ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-input-bg text-gray-700'}`}
      />
    </div>
  );
}