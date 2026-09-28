import styled from 'styled-components'
import { Section } from '../../components/ui/Layout'

export const HeroSection = styled(Section)`
  min-height: calc(100svh - 80px);
  overflow: hidden;
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.navy};
  border-radius: 0 0 ${({ theme }) => theme.radius.hero};
    ${({ theme }) => theme.radius.hero};
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: auto;
  }
  @media (min-width: 901px) {
    padding-bottom: 189px;
  }
  @media (min-width: 901px) and (max-height: 800px) {
    padding-bottom: 138px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: calc(100svh - 80px);
    padding-bottom: 42px;
    border-radius: 0 0 24px 24px;
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
    width: min(21vw, 82px);
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
    filter: blur(18px);
    opacity: 0.15;
    transform: scale(1.1);
  }
`
export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.18fr 0.82fr;
  align-items: end;
  gap: 56px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`
export const HeroTitle = styled.h1`
  max-width: 880px;
  margin: 24px 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(58px, 7.1vw, 106px);
  line-height: 0.91;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  span {
    color: ${({ theme }) => theme.colors.teal};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: clamp(49px, 14.8vw, 72px);
  }
`
export const HeroAside = styled.div`
  max-width: 430px;
  align-self: end;
  justify-self: end;
  p {
    margin: 0 0 30px;
    color: ${({ theme }) => theme.colors.slate};
    font-size: 18px;
    line-height: 1.62;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-self: auto;
    justify-self: start;
    max-width: 620px;
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
