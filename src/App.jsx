import { AuthProvider } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import AppRouter from '@/router/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRouter />
      </DataProvider>
    </AuthProvider>
  )
}
