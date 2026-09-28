import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --page-gutter: ${({ theme }) => theme.spacing.pageGutter};
    --section-space-top: ${({ theme }) => theme.spacing.sectionTop};
    --section-space-bottom: ${({ theme }) => theme.spacing.sectionBottom};
    --content-gap: ${({ theme }) => theme.spacing.contentGap};
  }
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; overflow-x: hidden; background: ${({ theme }) => theme.colors.page}; color: ${({ theme }) => theme.colors.ink}; font-family: ${({ theme }) => theme.fonts.body}; }
  button, input { font: inherit; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; }
  :focus-visible { outline: 3px solid ${({ theme }) => theme.colors.teal}; outline-offset: 4px; }
  section[id] { scroll-margin-top: 105px; }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    :root { --page-gutter: ${({ theme }) => theme.spacing.pageGutterTablet}; }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    :root {
      --page-gutter: ${({ theme }) => theme.spacing.pageGutterMobile};
      --section-space-top: 82px;
      --section-space-bottom: 82px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
  }
`
