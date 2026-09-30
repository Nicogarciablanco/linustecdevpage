import { Launch } from '@carbon/icons-react'
import { ButtonLink } from '../../components/ui/Button'
import { Container, DisplayHeading } from '../../components/ui/Layout'
import { ContactBottom, ContactPanel, ContactSection } from './Contact.styles'

export function Contact() {
  return (
    <ContactSection id="contacto">
      <Container>
        <ContactPanel>
          <DisplayHeading>
            Hagamos una web que tenga algo que{' '}
            <span className="accent">decir.</span>
          </DisplayHeading>
          <ContactBottom>
            <p>
              Elegí una solución cerrada o contanos una necesidad particular.
              Antes de empezar, siempre vas a saber qué incluye y cuánto cuesta.
            </p>
            <ButtonLink href="mailto:hola@linustec.dev">
              Contame tu proyecto <Launch size={16} aria-hidden="true" />
            </ButtonLink>
          </ContactBottom>
        </ContactPanel>
      </Container>
    </ContactSection>
  )
}
