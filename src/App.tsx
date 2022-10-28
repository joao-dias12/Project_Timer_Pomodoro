import { ThemeProvider } from "styled-components";
import { Button } from './components/Button';

import { GlobalStyle } from "./styles/global"; // Importando estilo global
import { defaultTheme } from "./styles/themes/default";

export function App() {
  return (

    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary" />
      <Button variant="secondary" />
      <Button variant="success" />
      <Button variant="danger" />
      <Button />
      <GlobalStyle /> 
      {/* Importando estilo global */}
    </ThemeProvider>
  )
}

