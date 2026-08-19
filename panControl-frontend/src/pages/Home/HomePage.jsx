import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { canAccess } from '@/config/permissions'
import Header from '@/components/layout/Header'
import logoFull from '@/assets/images/logo-full.png'

const MODULES = [
  { key: 'vendas', num: 1, label: 'Vendas', route: '/vendas', color: 'bg-green   hover:bg-green-dark', textColor: 'text-white' },
  { key: 'catalogo', num: 2, label: 'Catálogo', route: '/catalogo', color: 'bg-red     hover:bg-red-dark', textColor: 'text-white' },
  { key: 'producao', num: 3, label: 'Produção', route: '/producao', color: 'bg-brown   hover:bg-brown/80', textColor: 'text-white' },
  { key: 'relatorios', num: 4, label: 'Relatórios', route: '/relatorios', color: 'bg-brown-light hover:bg-cream', textColor: 'text-gray-800' },
  { key: 'gerenciamento', num: 5, label: 'Gerenciamento', route: '/gerenciamento', color: 'bg-gold    hover:bg-gold/80', textColor: 'text-gray-900' },
]

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Atalhos de teclado 1–5
  useEffect(() => {
    function handler(e) {
      const num = parseInt(e.key)
      if (isNaN(num)) return
      const mod = MODULES.find(m => m.num === num)
      if (mod && canAccess(user?.perfil, mod.key)) navigate(mod.route)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [user, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Logo marca d'água ao fundo */}
        <img
          src={logoFull}
          alt=""
          aria-hidden
          className="absolute inset-0 m-auto w-[540px] opacity-10 pointer-events-none select-none"
        />

        {/* Grid de módulos */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Linha 1 */}
          <div className="flex gap-5">
            {MODULES.slice(0, 3).map(mod => {
              const allowed = canAccess(user?.perfil, mod.key)
              return (
                <ModuleCard
                  key={mod.key}
                  mod={mod}
                  allowed={allowed}
                  onClick={() => allowed && navigate(mod.route)}
                />
              )
            })}
          </div>
          {/* Linha 2 */}
          <div className="flex gap-5">
            {MODULES.slice(3, 5).map(mod => {
              const allowed = canAccess(user?.perfil, mod.key)
              return (
                <ModuleCard
                  key={mod.key}
                  mod={mod}
                  allowed={allowed}
                  onClick={() => allowed && navigate(mod.route)}
                />
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

function ModuleCard({ mod, allowed, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!allowed}
      className={[
        'relative w-[190px] h-[140px] rounded-xl flex flex-col items-start justify-between p-4',
        'font-bold transition active:scale-95 shadow-sm',
        allowed ? `${mod.color} ${mod.textColor} cursor-pointer` : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60',
      ].join(' ')}
    >
      <span className="text-2xl opacity-80">{mod.num}</span>
      <span className="text-xl text-center w-full text-center leading-tight">{mod.label}</span>

      {/* Cadeado para bloqueados */}
      {!allowed && (
        <div className="absolute top-3 right-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      )}
    </button>
  )
}
