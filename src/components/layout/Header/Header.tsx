import { ButtonLink } from '../../ui/Button'
import { Logo } from '../../ui/Logo'
import {
  HeaderActions,
  HeaderBar,
  HeaderSlot,
  Navigation,
} from './Header.styles'

export function Header({ sticky }: { sticky: boolean }) {
  return (
    <HeaderSlot $sticky={sticky}>
      <HeaderBar $sticky={sticky} data-sticky={sticky}>
        <Logo href="#inicio" aria-label="LinusTec, inicio">
          /linustec<em>.dev</em>
        </Logo>
        <Navigation aria-label="Principal">
          <a href="#trabajos">Proyectos</a>
          <a href="#planes">Planes</a>
          <a href="#proceso">Proceso</a>
          <a href="#contacto">Contacto</a>
        </Navigation>
        <HeaderActions $sticky={sticky} aria-hidden={!sticky}>
          <ButtonLink href="#planes" tabIndex={sticky ? 0 : -1}>
            Ver planes ↗
          </ButtonLink>
          <ButtonLink
            $variant="secondary"
            href="#trabajos"
            tabIndex={sticky ? 0 : -1}
          >
            Explorar proyectos
          </ButtonLink>
        </HeaderActions>
      </HeaderBar>
    </HeaderSlot>
  )
}
