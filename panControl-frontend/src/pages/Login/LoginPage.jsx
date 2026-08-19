import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logoFull from '@/assets/images/logo-full.png'
import api from '@/services/api'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()
  const codeRef = useRef()

  // se já estiver logado, redireciona
  useEffect(() => { if (user) navigate('/home') }, [user, navigate])
  useEffect(() => { codeRef.current?.focus() }, [])

  async function handleLogin() {
    setError('')
    if (!code.trim() || !password.trim()) {
      setError('Preencha o código e a senha.')
      return
    }
    setLoading(true)
    try {
      // busca os usuários
      const res = await api.get('/usuarios');

      // cruza c/ o banco
      const usuarioLogado = res.data.find(u =>
        String(u.codigoAcesso) === code.trim() &&
        String(u.senhaHash) === password.trim()
      );

      if (usuarioLogado) {
        login(usuarioLogado);
        navigate('/home');
      } else {
        setError('Código de acesso ou senha inválidos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
    }
    setLoading(false)
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-header h-[72px] flex items-center justify-between px-6 shadow">
        <span className="text-white font-bold text-xl">
          Pan<span className="text-gold">Control</span>+
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="flex items-center gap-24 w-full max-w-4xl">

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <img src={logoFull} alt="PanControl+" className="w-72 object-contain" />
          </div>

          {/* Formulário */}
          <div className="flex-1 flex flex-col gap-6 max-w-sm">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-800">Usuário:</label>
              <input
                ref={codeRef}
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite seu código de acesso..."
                className="bg-input-bg border border-gray-200 rounded px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-800">Senha:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua senha..."
                className="bg-input-bg border border-gray-200 rounded px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-gray-400"
              />
            </div>

            {error && (
              <p className="text-red text-sm font-semibold">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-green hover:bg-green-dark text-white font-bold py-4 rounded
                         transition active:scale-95 disabled:opacity-50 text-base mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-xs text-gray-400 border border-gray-100 rounded p-3 space-y-0.5" style={{ textAlign: 'justify' }}>
              <p className="font-semibold text-gray-500 mb-1">Algum problema?</p>
              <p>
                👤 Se você esqueceu seu código de acesso ou senha, entre em contato com um administrador para redefinir suas credenciais.
              </p>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
