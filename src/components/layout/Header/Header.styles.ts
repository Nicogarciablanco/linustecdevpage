import styled, { css } from 'styled-components'

export const HeaderSlot = styled.div<{ $sticky: boolean }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.header};
  height: 80px;
  background: ${({ $sticky, theme }) => ($sticky ? 'transparent' : theme.colors.navy)};
  pointer-events: none;
`
export const HeaderBar = styled.header<{ $sticky: boolean }>`
  position: relative;
  top: 7px;
  left: 0;
  width: calc(100% - 14px);
  min-height: 66px;
  margin-inline: 7px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: 18px;
  padding: 13px 22px;
  border: 1px solid transparent;
  border-radius: 0;
  color: ${({ theme }) => theme.colors.white};
  background: transparent;
  backdrop-filter: blur(0);
  box-shadow: none;
  transform: translateY(0);
  pointer-events: auto;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    border-radius 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease;
  ${({ $sticky, theme }) =>
    $sticky &&
    css`
      position: fixed;
      top: 7px;
      border-color: rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      background: rgba(8, 17, 35, 0.86);
      backdrop-filter: blur(18px);
      box-shadow: ${theme.shadows.header};
    `}
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    column-gap: 8px;
    padding: 10px 12px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-self: center;
  gap: 28px;
  color: ${({ theme }) => theme.colors.slate};
  font-size: 13px;
  a:hover {
    color: ${({ theme }) => theme.colors.white};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`
export const HeaderActions = styled.div<{ $sticky: boolean }>`
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  opacity: ${({ $sticky }) => ($sticky ? 1 : 0)};
  visibility: ${({ $sticky }) => ($sticky ? 'visible' : 'hidden')};
  pointer-events: ${({ $sticky }) => ($sticky ? 'auto' : 'none')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  a {
    min-height: 38px;
    padding: 0 15px;
    font-size: 12px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 4px;
    a {
      min-height: 34px;
      padding: 0 6px;
      font-size: 9px;
    }
  }
  @media (max-width: 360px) {
    a:last-child {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
