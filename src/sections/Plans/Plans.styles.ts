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
export const PlanCard = styled.article<{ $featured: boolean }>`
  min-height: 430px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border: 1px solid
    ${({ $featured, theme }) => ($featured ? theme.colors.teal : theme.colors.line)};
  border-radius: ${({ theme }) => theme.radius.plan};
  background: ${({ theme }) => theme.colors.page};
  box-shadow: ${({ $featured }) => ($featured ? 'inset 0 0 0 1px #00d2a0, 0 24px 80px rgba(0,210,160,.09)' : 'none')};
  transition:
    transform 0.25s,
    border-color 0.25s;
  &:hover {
    transform: translateY(-7px);
    border-color: ${({ theme }) => theme.colors.teal};
  }
  .number {
    color: ${({ theme }) => theme.colors.tealText};
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 16px;
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
`
