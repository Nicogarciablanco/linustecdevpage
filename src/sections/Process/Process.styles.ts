import styled from 'styled-components'
export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`
export const Step = styled.article`
  min-height: 210px;
  padding: 28px 28px 20px 0;
  &:not(:first-child) {
    padding-left: 28px;
  }
  b {
    color: ${({ theme }) => theme.colors.tealText};
  }
  h3 {
    margin: 50px 0 12px;
    font-size: 19px;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    line-height: 1.6;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 0;
    h3 {
      margin-top: 30px;
    }
  }
`
