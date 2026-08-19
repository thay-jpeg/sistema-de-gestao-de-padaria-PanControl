import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Header({ title, showBack = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const formatarCargo = (perfil) => {
    if (perfil === 'GESTOR') return 'Gestor(a)';
    if (perfil === 'PRODUTOR') return 'Produtor(a)';
    if (perfil === 'ATENDENTE') return 'Atendente';
    return '';
  }

  return (
    <header className="bg-header h-[72px] flex items-center justify-between px-6 shadow-md flex-shrink-0">

      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            title="Voltar"
            className="w-9 h-9 rounded-full bg-gold flex items-center justify-center hover:opacity-80 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <button
          onClick={() => navigate('/home')}
          className="text-white font-bold text-xl tracking-wide hover:opacity-80 transition"
        >
          Pan<span className="text-gold">Control</span>+
        </button>

        {title && (
          <>
            <span className="text-white/40">|</span>
            <span className="text-white font-semibold text-base">{title}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-white font-semibold text-sm">
            {formatarCargo(user.perfil)} {user.nomeUsuario}
          </span>
        )}

        <span className="text-white/40">|</span>

        <button
          onClick={handleLogout}
          title="Sair do Sistema"
          className="text-white hover:text-gold transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}