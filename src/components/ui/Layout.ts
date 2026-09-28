import styled from 'styled-components'

export const Container = styled.div`
  width: calc(100% - var(--page-gutter) - var(--page-gutter));
  margin-inline: auto;
`

export const Section = styled.section`
  position: relative;
  display: grid;
  padding-block: var(--section-space-top) var(--section-space-bottom);
`

export const DisplayHeading = styled.h2`
  margin: 0;
  max-width: 870px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(42px, 5.3vw, 72px);
  line-height: 0.97;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  .accent {
    color: ${({ theme }) => theme.colors.tealHeading};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 41px;
  }
`

export const SectionCopy = styled.p`
  max-width: 560px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 17px;
  line-height: 1.7;
`

export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--content-gap);
  margin-bottom: var(--content-gap);
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: var(--content-gap);
  }
`
