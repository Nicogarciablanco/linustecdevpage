import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'

export const PlansSection = styled(Section)`
  border-radius: 34px;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.ink};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-radius: 24px;
  }
`

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 1279px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const PlanInclusions = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    position: relative;
    padding-left: 18px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.45;
  }
  li::before {
    content: '';
    position: absolute;
    top: 0.55em;
    left: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.tealHeading};
  }
`

export const PlanArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(18px, 1.5vw, 24px);
  border: 1px solid #cfd6d5;
  border-radius: ${({ theme }) => theme.radius.plan};
  background: ${({ theme }) => theme.colors.page};
  transition: border-color 0.2s;
  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.tealDark};
  }
  &[data-cursor-active='true'],
  &[data-cursor-active='true'] * {
    cursor: none;
  }
  .plan-overview {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 330px;
  }
  .number {
    margin-bottom: 18px;
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  h3 {
    margin: 0 0 12px;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(25px, 2.1vw, 30px);
    font-weight: ${({ theme }) => theme.typography.titleWeight};
    line-height: ${({ theme }) => theme.typography.titleLineHeight};
    text-transform: uppercase;
    overflow-wrap: break-word;
  }
  .audience {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.5;
  }
  .price {
    margin-top: auto;
    margin-bottom: 14px;
  }
  .price strong {
    color: ${({ theme }) => theme.colors.ink};
    font-size: 24px;
  }
  .plan-actions {
    display: grid;
    gap: 8px;
    margin-bottom: 24px;
  }
  .plan-details {
    min-width: 0;
    padding-top: 18px;
    border-top: 1px solid #c6cecb;
  }
  .base-label {
    margin: 0 0 15px;
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .boundary {
    margin: 18px 0 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.5;
  }
  .boundary strong {
    color: ${({ theme }) => theme.colors.ink};
  }
  .boundary p {
    margin: 5px 0 0;
  }
  @media (max-width: 1279px) {
    .plan-overview {
      min-height: 290px;
    }
  }
  @media (max-width: 700px) {
    .plan-overview {
      min-height: 0;
    }
  }
`

export const PlanButton = styled.button`
  display: inline-flex;
  min-height: 46px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.teal};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealText};
    outline-offset: 3px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 48px;
    font-size: 14px;
  }
`

export const PlanSecondaryButton = styled(PlanButton)`
  border-color: ${({ theme }) => theme.colors.tealHeading};
  background: transparent;
  color: ${({ theme }) => theme.colors.tealText};
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
