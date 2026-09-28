import styled, { css } from 'styled-components'

export const RailTrack = styled.div<{ $dragging: boolean }>`
  position: relative;
  width: 100%;
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px var(--page-gutter) 22px 0;
  background: ${({ theme }) => theme.colors.page};
  cursor: grab;
  user-select: none;
  scroll-padding-left: 0;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealHeading};
    outline-offset: -3px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ $dragging }) =>
    $dragging &&
    css`
      cursor: grabbing;
      scroll-snap-type: none;
      scroll-behavior: auto;
    `}

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`

export const RailScrollbar = styled.div`
  position: relative;
  height: 20px;
  margin-top: clamp(30px, 3.2vw, 60px);
  cursor: grab;
  touch-action: none;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 2px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.14);
    transform: translateY(-50%);
  }

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealHeading};
    outline-offset: 3px;
  }
`

export const RailScrollbarThumb = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 55%;
  height: 5px;
  border-radius: 999px;
  background: #000;
  transform: translateY(-50%);
`

export const RailCursor = styled.div`
  position: fixed;
  z-index: 40;
  top: 0;
  left: 0;
  width: 85px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 999px;
  background: #f0ff4c;
  color: #000;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
  transition:
    opacity 140ms ease-out,
    visibility 0s linear 140ms;

  &[data-visible='true'] {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 140ms ease-out,
      visibility 0s;
  }

  @media (pointer: coarse) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &[data-visible='true'] {
      transition: none;
    }
  }
`

export const RailContent = styled.div`
  display: flex;
  width: max-content;
  gap: 20px;
`

export const ProjectCard = styled.article`
  flex: 0 0 clamp(300px, calc(25vw - 5px), 475px);
  min-width: 0;
  overflow: hidden;
  scroll-snap-align: start;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.surface};
  transition: transform ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    transform: translateY(-3px);
  }

  @media (hover: hover) and (pointer: fine) {
    cursor: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: clamp(300px, 39vw, 350px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-basis: 84vw;
  }
`

export const ProjectVisual = styled.div<{ $background: string }>`
  position: relative;
  height: clamp(320px, calc(25.9vw - 3px), 495px);
  display: grid;
  place-items: end center;
  overflow: hidden;
  border-radius: 7px;
  background: ${({ $background }) => $background};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: auto;
    aspect-ratio: 1;
  }
`

export const ProjectImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const BrowserMock = styled.div`
  position: relative;
  width: 88%;
  height: 80%;
  display: flex;
  flex-direction: column;
  padding: clamp(16px, 1.5vw, 22px);
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 20px 20px 0 0;
  background: rgba(250, 251, 248, 0.9);
  box-shadow: 0 26px 80px rgba(2, 6, 23, 0.2);
  color: ${({ theme }) => theme.colors.ink};

  &::after {
    content: '';
    position: absolute;
    right: 9%;
    bottom: -11%;
    width: 32%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 86%;
    height: 78%;
    padding: 16px;
  }
`

export const BrowserDots = styled.div`
  display: flex;
  gap: 7px;
  padding-bottom: clamp(14px, 2vw, 28px);
  border-bottom: 1px solid rgba(2, 6, 23, 0.13);

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.muted};
  }
`

export const MockTitle = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  max-width: 100%;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(25px, 2vw, 34px);
  line-height: 0.96;
  letter-spacing: -0.06em;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: clamp(27px, 8vw, 32px);
  }
`

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: clamp(100px, calc(9.75vw - 33px), 154px);
  margin: 0 -8px -8px;
  padding: 16px 20px 20px;
  background: ${({ theme }) => theme.colors.page};

  small {
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h3 {
    margin: 6px 0 0;
    font-size: clamp(23px, 1.8vw, 28px);
    line-height: 1.06;
    letter-spacing: -0.035em;
  }

  a {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.ink};
    font-size: 14px;
    font-weight: 800;
    text-underline-offset: 5px;
    cursor: pointer;
  }

  a:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.tealHeading};
    outline-offset: 5px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 108px;
    padding: 16px 20px 20px;
  }
`
