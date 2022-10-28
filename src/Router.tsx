import { Route, Routes } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'

import { Home } from './pages/Home'

export function Router() { //Criando as rotas a adicionando a default como padrão
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}> 
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}