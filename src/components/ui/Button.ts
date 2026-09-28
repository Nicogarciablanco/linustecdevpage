import styled from 'styled-components'

export const ButtonLink = styled.a<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
  padding: 0 23px;
  border: 1px solid
    ${({ $variant }) => ($variant === 'secondary' ? 'rgba(248,250,252,.34)' : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ $variant, theme }) => ($variant === 'secondary' ? theme.colors.white : theme.colors.ink)};
  background: ${({ $variant, theme }) => ($variant === 'secondary' ? 'transparent' : theme.colors.teal)};
  box-shadow: ${({ $variant }) => ($variant === 'secondary' ? 'none' : '0 0 30px rgba(0,210,160,.23)')};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`

export const PrimaryButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
  padding: 0 23px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.teal};
  color: ${({ theme }) => theme.colors.ink};
  box-shadow: 0 0 30px rgba(0, 210, 160, 0.23);
  font-size: 14px;
  font-weight: 700;
`
