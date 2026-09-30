import styled from 'styled-components'
import { DisplayHeading } from '../../components/ui/Layout'

export const Dialog = styled.dialog`
  width: min(${({ theme }) => theme.widths.dialog}, calc(100% - 32px));
  max-height: min(760px, calc(100svh - 32px));
  margin: auto;
  padding: 0;
  overflow: auto;
  overflow-x: hidden;
  color: ${({ theme }) => theme.colors.ink};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.dialog};
  &::backdrop {
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
  }
`
export const DialogContent = styled.div`
  position: relative;
  padding: 34px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px;
  }
`
export const DialogTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  p {
    margin: 0 0 24px;
  }

  > div {
    min-width: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;

    p {
      padding-right: 52px;
    }
  }
`
export const DialogTitle = styled(DisplayHeading)`
  max-width: 560px;
  font-size: clamp(34px, 5vw, 52px);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: clamp(30px, 8.7vw, 34px);
  }
`
export const CloseButton = styled.button`
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.ink};
  background: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: absolute;
    top: 18px;
    right: 18px;
  }
`
export const DialogCopy = styled.p`
  max-width: 560px;
  margin: 22px 0 30px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
`
export const ChecksLabel = styled.span`
  display: block;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`
export const CheckGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`
export const CheckOption = styled.label`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-height: 72px;
  padding: 16px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.page};
  transition:
    border-color 0.2s,
    background 0.2s;
  &:has(input:checked) {
    border-color: ${({ theme }) => theme.colors.teal};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.teal} 9%,
      ${({ theme }) => theme.colors.page}
    );
  }
  input {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: ${({ theme }) => theme.colors.teal};
  }
  strong {
    display: block;
    font-size: 14px;
  }
  small {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.45;
  }
`
export const DialogBottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  p {
    max-width: 390px;
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.55;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: flex-start;
    flex-direction: column;
  }
`
