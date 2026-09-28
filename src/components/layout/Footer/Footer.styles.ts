import styled from 'styled-components'
export const FooterWrap = styled.footer`
  padding: 40px 0 54px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 28px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 13px;
  a {
    color: ${({ theme }) => theme.colors.ink};
  }
  em {
    color: ${({ theme }) => theme.colors.tealText};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
`
