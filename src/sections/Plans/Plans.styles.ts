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
    font-size: 14px;
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
  cursor: default;
  transition: border-color 0.2s;
  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.tealDark};
  }
  .plan-overview {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 295px;
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
    font-size: clamp(25px, 2vw, 32px);
    font-weight: ${({ theme }) => theme.typography.titleWeight};
    line-height: ${({ theme }) => theme.typography.titleLineHeight};
    text-transform: uppercase;
    overflow-wrap: break-word;
  }
  .audience {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    line-height: 1.5;
  }
  .price {
    margin-top: auto;
    margin-bottom: 14px;
  }
  .price strong {
    color: ${({ theme }) => theme.colors.ink};
    font-size: clamp(24px, 1.5vw, 28px);
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
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .plan-detail-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    margin-top: auto;
    padding-top: 20px;
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 14px;
    font-weight: 700;
  }
  .plan-detail-link:hover {
    text-decoration: underline;
  }
  @media (max-width: 1279px) {
    h3 {
      font-size: clamp(25px, 3.4vw, 31px);
    }
    .plan-overview {
      min-height: 255px;
    }
  }
  @media (max-width: 700px) {
    h3 {
      font-size: clamp(24px, 6.7vw, 28px);
    }
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
  border: 1px solid ${({ theme }) => theme.colors.tealHeading};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.tealText};
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 240ms ease,
    border-color 240ms ease,
    color 240ms ease;
  &:hover {
    border-color: transparent;
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.teal};
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealText};
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 48px;
    font-size: 14px;
  }
`

export const PlanSecondaryButton = PlanButton
