import { ButtonLink } from '../../components/ui/Button'
import { Container } from '../../components/ui/Layout'
import {
  HeroActions,
  HeroAside,
  HeroBrand,
  HeroContent,
  HeroSection,
  HeroTitle,
  HeroBrandImage,
} from './Hero.styles'

const linustecSymbol = new URL(
  '../../assets/brand/linustec-symbol.svg',
  import.meta.url,
).href

export function Hero({ sticky }: { sticky: boolean }) {
  return (
    <HeroSection id="inicio">
      <HeroBrand aria-hidden="true">
        <HeroBrandImage
          src={linustecSymbol}
          alt=""
          width="6045"
          height="7199"
        />
      </HeroBrand>
      <HeroContent as={Container}>
        <HeroTitle>
          Tu web tiene que <span>trabajar</span> por tu negocio.
        </HeroTitle>
        <HeroAside>
          <p>
            Diseñamos y desarrollamos experiencias digitales rápidas, claras y
            listas para convertir visitas en consultas o pedidos.
          </p>
          {!sticky && (
            <HeroActions>
              <ButtonLink href="#planes">Ver planes ↗</ButtonLink>
              <ButtonLink $variant="secondary" href="#trabajos">
                Explorar proyectos
              </ButtonLink>
            </HeroActions>
          )}
        </HeroAside>
      </HeroContent>
    </HeroSection>
  )
}
