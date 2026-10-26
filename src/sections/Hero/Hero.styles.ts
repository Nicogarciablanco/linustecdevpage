import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'

export const HeroSection = styled(Section)`
  min-height: calc(100svh - 80px);
  overflow: hidden;
  align-items: center;
  padding: 64px 0 144px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.navy};
  border-radius: 0 0 ${({ theme }) => theme.radius.hero}
    ${({ theme }) => theme.radius.hero};
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 48px 0 128px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 0 104px;
    border-radius: 0 0 24px 24px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) and (max-height: 700px) {
    padding: 12px 0 92px;
  }
`
export const HeroBrand = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: min(clamp(280px, 34vw, 460px), 46svh);
  transform: translate(-50%, -50%);
  pointer-events: none;

  @media (max-height: 800px) {
    width: min(clamp(280px, 34vw, 460px), 42svh);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: min(34vw, 260px, 42svh);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: min(38vw, 148px);
  }
`

export const HeroBrandImage = styled.img`
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: blur(24px);
  opacity: 0.2;
  transform: scale(1.16);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    filter: blur(12px);
    opacity: 0.24;
    transform: scale(1.1);
  }
`
export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: start;
  gap: clamp(24px, 4vh, 40px);
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) and (max-height: 700px) {
    gap: 40px;
  }
`
export const HeroTitle = styled.h1`
  max-width: 880px;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(50px, 7.1vw, 95px);
  font-weight: ${({ theme }) => theme.typography.titleWeight};
  line-height: ${({ theme }) => theme.typography.titleLineHeight};
  text-transform: uppercase;

  span {
    color: ${({ theme }) => theme.colors.teal};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: clamp(49px, 14.8vw, 72px);
  }
`
export const HeroAside = styled.div`
  max-width: 640px;
  align-self: start;
  justify-self: start;
  p {
    margin: 0 0 30px;
    color: ${({ theme }) => theme.colors.slate};
    font-size: 22px;
    line-height: 1.62;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    p {
      font-size: 16px;
    }
  }
`
export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`
