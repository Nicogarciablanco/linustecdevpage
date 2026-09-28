import 'styled-components'
import type { theme } from './theme'
type AppTheme = typeof theme

declare module 'styled-components' {
  // Styled Components requires interface augmentation for theme inference.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
