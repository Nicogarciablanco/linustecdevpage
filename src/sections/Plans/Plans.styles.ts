import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'

export const PlansSection = styled(Section)`
  border-radius: 34px;
  background: ${({ theme }) => theme.colors.surface};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-radius: 24px;
  }
`
export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`
export const PlanCard = styled.article`
  position: relative;
  min-height: 430px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.plan};
  background: ${({ theme }) => theme.colors.page};
  transition:
    transform 0.25s,
    border-color 0.25s,
    border-width 0.25s;
  &:hover {
    transform: translateY(-7px);
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.teal};
  }
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.teal};
  }
  &[data-cursor-active='true'],
  &[data-cursor-active='true'] * {
    cursor: none;
  }
  .number {
    color: ${({ theme }) => theme.colors.tealText};
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
  }
  h3 {
    margin: 70px 0 16px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 34px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -0.04em;
  }
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.65;
  }
  ul {
    margin: 16px 0 34px;
    padding: 0;
    list-style: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    line-height: 1.9;
  }
  li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
  }
  li svg {
    flex: 0 0 auto;
    margin-top: 5px;
    color: ${({ theme }) => theme.colors.tealText};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 360px;
    h3 {
      margin-top: 42px;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px;
  }
`
export const PlanButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin-top: auto;
  padding: 18px 0 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  color: inherit;
  background: transparent;
  text-align: left;
  font-weight: 800;
  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    inset: 0;
  }
`

export const PlanCursor = styled.div`
  position: fixed;
  z-index: 40;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.teal};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;

  &[data-visible='true'] {
    opacity: 1;
    visibility: visible;
  }

  @media (pointer: coarse), (prefers-reduced-motion: reduce) {
    display: none;
  }
`
