import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function DefaultLayout() { // Criando O layout Padrão
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}