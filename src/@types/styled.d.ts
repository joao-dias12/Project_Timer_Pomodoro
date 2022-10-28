import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme; /* definimos o TheType como o mesmo tipo de defaultTheme */
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

/*
Arquivo para definirmos o arquivo dos possiveis temas da nossa aplicação. Pegamos uma parte da biblioteca
"Styled Componetes" e então extendemos o nosso Theme Type*/
