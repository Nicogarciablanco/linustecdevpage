import { Container } from '../../ui/Layout'
import { Logo } from '../../ui/Logo'
import { FooterRow, FooterWrap } from './Footer.styles'
export function Footer() {
  return (
    <FooterWrap>
      <FooterRow as={Container}>
        <Logo href="#inicio">
          /linustec<em>.dev</em>
        </Logo>
        <span>Diseño y desarrollo web · Argentina</span>
        <span>© 2026 LinusTec</span>
      </FooterRow>
    </FooterWrap>
  )
}
