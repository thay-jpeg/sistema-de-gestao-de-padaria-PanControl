import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { canAccess } from '@/config/permissions'

import LoginPage          from '@/pages/Login/LoginPage'
import HomePage           from '@/pages/Home/HomePage'
import VendasPage         from '@/pages/Vendas/VendasPage'
import CatalogoPage       from '@/pages/Catalogo/CatalogoPage'
import ProducaoPage       from '@/pages/Producao/ProducaoPage'
import RelatoriosPage     from '@/pages/Relatorios/RelatoriosPage'
import GerenciamentoPage  from '@/pages/Gerenciamento/GerenciamentoPage'
import PedidosVendaPage   from '@/pages/PedidosVenda/PedidosVendaPage'

function PrivateRoute({ module, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (module && !canAccess(user.role, module)) return <Navigate to="/home" replace />
  return children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/vendas"        element={<PrivateRoute module="vendas">        <VendasPage /></PrivateRoute>} />
        <Route path="/catalogo"      element={<PrivateRoute module="catalogo">      <CatalogoPage /></PrivateRoute>} />
        <Route path="/producao"      element={<PrivateRoute module="producao">      <ProducaoPage /></PrivateRoute>} />
        <Route path="/relatorios"    element={<PrivateRoute module="relatorios">    <RelatoriosPage /></PrivateRoute>} />
        <Route path="/gerenciamento" element={<PrivateRoute module="gerenciamento"> <GerenciamentoPage /></PrivateRoute>} />
        <Route path="/pedidos-venda" element={<PrivateRoute module="pedidosVenda">  <PedidosVendaPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
