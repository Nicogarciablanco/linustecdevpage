import styled from 'styled-components'

export const Logo = styled.a`
  color: ${({ theme }) => theme.colors.white};
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.7px;
  white-space: nowrap;
  em {
    color: ${({ theme }) => theme.colors.teal};
    font-style: normal;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 17px;
  }
`
