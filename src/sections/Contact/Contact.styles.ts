import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'
export const ContactSection = styled(Section)`
  padding-block: var(--section-space-top) var(--section-space-bottom);
`
export const ContactPanel = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 520px;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.white};
  border-radius: 32px;
  background: ${({ theme }) => theme.colors.ink};
  &::after {
    content: '';
    position: absolute;
    width: 460px;
    height: 460px;
    right: -100px;
    bottom: -130px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.teal};
    filter: blur(60px);
    opacity: 0.32;
  }
  h2 {
    position: relative;
    z-index: 1;
    max-width: 930px;
    .accent {
      color: ${({ theme }) => theme.colors.tealDark};
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 500px;
    padding: 28px;
    border-radius: 24px;
  }
`
export const ContactBottom = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  p {
    max-width: 480px;
    color: ${({ theme }) => theme.colors.slate};
    line-height: 1.6;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: flex-start;
    flex-direction: column;
  }
`
