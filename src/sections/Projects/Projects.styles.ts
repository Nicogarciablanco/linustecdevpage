import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'

export const ProjectsSection = styled(Section)`
  min-height: auto;
  display: block;
  padding: var(--section-space-top, 100px) 0 var(--section-space-bottom, 90px);
  background: ${({ theme }) => theme.colors.page};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: var(--section-space-top, 72px) 0 var(--section-space-bottom, 72px);
  }
`

export const ProjectsHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--content-gap, 36px);
  margin-bottom: var(--content-gap, 36px);

  > a {
    margin-top: 8px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 22px;
    margin-bottom: var(--content-gap, 30px);

    > a {
      margin-top: 0;
      justify-self: start;
    }
  }
`
