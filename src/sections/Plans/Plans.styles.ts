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
  .plans-note {
    margin: 22px 0 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-radius: 24px;
  }
`

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
`

export const PlanInclusions = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
  counter-reset: inclusion;
  li {
    position: relative;
    padding-left: 38px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.55;
    counter-increment: inclusion;
    &::before {
      content: counter(inclusion, decimal-leading-zero);
      position: absolute;
      top: 0;
      left: 0;
      color: ${({ theme }) => theme.colors.tealText};
      font-weight: 800;
    }
  }
  strong {
    display: block;
    margin-bottom: 3px;
    color: ${({ theme }) => theme.colors.ink};
    font-size: 14px;
  }
  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const PlanArticle = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.4fr);
  align-items: start;
  gap: clamp(28px, 4vw, 72px);
  min-width: 0;
  padding: clamp(24px, 2.3vw, 40px);
  border: 1px solid #cfd6d5;
  border-radius: ${({ theme }) => theme.radius.plan};
  background: ${({ theme }) => theme.colors.page};
  transition: border-color 0.2s;
  .plan-overview,
  .plan-details {
    min-width: 0;
  }
  .plan-overview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.tealDark};
  }
  &[data-cursor-active='true'],
  &[data-cursor-active='true'] * {
    cursor: none;
  }
  .number {
    margin-bottom: 30px;
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    line-height: 1.5;
    text-transform: uppercase;
  }
  h3 {
    max-width: 540px;
    margin: 0 0 18px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(24px, 2.1vw, 29px);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.055em;
    text-transform: uppercase;
    overflow-wrap: break-word;
  }
  .audience {
    margin: 0 0 22px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.6;
  }
  .base-label {
    margin: 3px 0 21px;
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .boundary {
    margin-bottom: 20px;
    font-size: 12px;
    line-height: 1.6;
    strong {
      display: block;
      margin-bottom: 7px;
    }
    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
  details {
    border-bottom: 1px solid #c6cecb;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    line-height: 1.55;
    summary {
      padding: 20px 0;
      color: ${({ theme }) => theme.colors.ink};
      font-weight: 700;
      cursor: pointer;
      overflow-wrap: break-word;
    }
    summary::marker {
      color: ${({ theme }) => theme.colors.tealText};
    }
    summary:focus-visible {
      outline: 3px solid ${({ theme }) => theme.colors.tealText};
      outline-offset: 2px;
    }
  }
  details:first-child {
    border-top: 1px solid #c6cecb;
  }
  .disclosure-content {
    margin: 0;
    padding: 2px 0 22px;
  }
  .material-list {
    display: grid;
    gap: 8px;
    padding-left: 18px;
  }
  .extras-list {
    display: grid;
    gap: 18px;
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }
    li > div {
      min-width: 0;
    }
    strong {
      color: ${({ theme }) => theme.colors.ink};
    }
    p {
      margin: 4px 0 0;
    }
    b {
      color: ${({ theme }) => theme.colors.tealText};
      white-space: nowrap;
      font-size: 12px;
    }
  }
  .price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 3px 8px;
    width: 100%;
    max-width: 420px;
    margin-top: 12px;
    margin-bottom: 22px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    strong {
      color: ${({ theme }) => theme.colors.ink};
      font-size: 16px;
      white-space: nowrap;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    .audience {
      max-width: 560px;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 22px;
    .number {
      margin-bottom: 18px;
    }
    .extras-list li {
      flex-wrap: wrap;
      gap: 4px;
    }
  }
`

export const PlanButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 18px;
  border: 0;
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.teal};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealText};
    outline-offset: 3px;
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
