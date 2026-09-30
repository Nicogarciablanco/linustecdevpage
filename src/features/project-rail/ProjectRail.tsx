import { ArrowsHorizontal, Launch } from '@carbon/icons-react'
import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { projects } from '../../data/projects'
import type { Project } from '../../types/project'
import { useHorizontalDrag } from '../../hooks/useHorizontalDrag'
import {
  BrowserDots,
  BrowserMock,
  MockTitle,
  ProjectCard,
  ProjectImage,
  ProjectMeta,
  ProjectVisual,
  RailContent,
  RailCursor,
  RailScrollbar,
  RailScrollbarThumb,
  RailTrack,
} from './ProjectRail.styles'

function hasProjectUrl(url?: string) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function ProjectRail({
  items = projects,
}: {
  items?: readonly Project[]
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorFrame = useRef<number | null>(null)
  const cursorPosition = useRef({ x: 0, y: 0 })
  const thumbGrabOffset = useRef<number | null>(null)
  const drag = useHorizontalDrag()

  const syncScrollbar = useCallback(() => {
    const rail = railRef.current
    const scrollbar = scrollbarRef.current
    const thumb = thumbRef.current
    if (!rail || !scrollbar || !thumb) return

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const trackWidth = scrollbar.clientWidth
    if (!trackWidth) return

    const visibleFraction = rail.scrollWidth
      ? rail.clientWidth / rail.scrollWidth
      : 1
    const thumbWidth = Math.min(
      trackWidth,
      Math.max(48, Math.min(trackWidth * 0.55, trackWidth * visibleFraction)),
    )
    const progress = maxScroll ? Math.min(1, rail.scrollLeft / maxScroll) : 0
    thumb.style.width = `${thumbWidth}px`
    thumb.style.transform = `translate3d(${progress * (trackWidth - thumbWidth)}px, -50%, 0)`
    scrollbar.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    scrollbar.setAttribute(
      'aria-valuetext',
      `${Math.round(progress * 100)} % recorrido`,
    )
    scrollbar.setAttribute('aria-disabled', String(maxScroll === 0))
  }, [])

  useEffect(() => {
    const reset = () => {
      if (railRef.current) railRef.current.scrollLeft = 0
      syncScrollbar()
    }
    reset()
    window.addEventListener('pageshow', reset)
    window.addEventListener('resize', syncScrollbar)
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(syncScrollbar)
    if (railRef.current) {
      observer?.observe(railRef.current)
      if (railRef.current.firstElementChild)
        observer?.observe(railRef.current.firstElementChild)
    }
    if (scrollbarRef.current) observer?.observe(scrollbarRef.current)
    return () => {
      window.removeEventListener('pageshow', reset)
      window.removeEventListener('resize', syncScrollbar)
      observer?.disconnect()
      if (cursorFrame.current !== null)
        window.cancelAnimationFrame(cursorFrame.current)
    }
  }, [syncScrollbar])

  function hideCursor() {
    if (cursorFrame.current !== null) {
      window.cancelAnimationFrame(cursorFrame.current)
      cursorFrame.current = null
    }
    if (cursorRef.current?.dataset.visible === 'true')
      cursorRef.current.dataset.visible = 'false'
    if (railRef.current?.dataset.cursorActive === 'true')
      railRef.current.dataset.cursorActive = 'false'
  }

  function moveCursor(event: PointerEvent<HTMLDivElement>) {
    const cursor = cursorRef.current
    if (!cursor || event.pointerType !== 'mouse') {
      hideCursor()
      return
    }
    const target = drag.isDragging
      ? (document.elementFromPoint?.(event.clientX, event.clientY) ??
        event.target)
      : event.target
    const element = target instanceof Element ? target : null
    const card = element?.closest('article')
    if (
      !card ||
      !railRef.current?.contains(card) ||
      element?.closest('a, button, input, select, textarea, [role="button"]')
    ) {
      hideCursor()
      return
    }
    cursorPosition.current.x = event.clientX
    cursorPosition.current.y = event.clientY
    if (cursorFrame.current !== null) return
    cursorFrame.current = -1
    const frame = window.requestAnimationFrame(() => {
      cursorFrame.current = null
      const current = cursorRef.current
      if (!current) return
      const { x, y } = cursorPosition.current
      current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      const rail = railRef.current
      if (rail && rail.dataset.cursorActive !== 'true')
        rail.dataset.cursorActive = 'true'
      if (current.dataset.visible !== 'true') current.dataset.visible = 'true'
    })
    if (cursorFrame.current !== null) cursorFrame.current = frame
  }

  function scrollFromScrollbar(clientX: number) {
    const rail = railRef.current
    const scrollbar = scrollbarRef.current
    const thumb = thumbRef.current
    if (!rail || !scrollbar || !thumb) return
    const track = scrollbar.getBoundingClientRect()
    const thumbWidth = thumb.getBoundingClientRect().width
    const available = track.width - thumbWidth
    const maxScroll = rail.scrollWidth - rail.clientWidth
    if (available <= 0 || maxScroll <= 0) return
    const offset = thumbGrabOffset.current ?? thumbWidth / 2
    const position = Math.max(
      0,
      Math.min(available, clientX - track.left - offset),
    )
    rail.scrollLeft = (position / available) * maxScroll
    syncScrollbar()
  }

  function onScrollbarPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const thumb = thumbRef.current
    const rail = railRef.current
    if (!thumb || !rail) return
    event.preventDefault()
    const thumbRect = thumb.getBoundingClientRect()
    thumbGrabOffset.current = thumb.contains(event.target as Node)
      ? event.clientX - thumbRect.left
      : thumbRect.width / 2
    rail.style.scrollSnapType = 'none'
    rail.style.scrollBehavior = 'auto'
    event.currentTarget.setPointerCapture(event.pointerId)
    scrollFromScrollbar(event.clientX)
  }

  function onScrollbarPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (thumbGrabOffset.current !== null) scrollFromScrollbar(event.clientX)
  }

  function onScrollbarPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (thumbGrabOffset.current === null) return
    thumbGrabOffset.current = null
    const rail = railRef.current
    if (rail) {
      rail.style.removeProperty('scroll-behavior')
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    syncScrollbar()
  }

  function onScrollbarKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rail = railRef.current
    if (!rail) return
    if (!['Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
    rail.style.scrollSnapType = 'none'
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      rail.scrollTo({ left: event.key === 'Home' ? 0 : maxScroll })
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      rail.scrollBy({
        left: maxScroll * (event.key === 'ArrowRight' ? 0.1 : -0.1),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    const rail = railRef.current
    if (!rail) return
    rail.style.removeProperty('scroll-snap-type')

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const project = rail.querySelector<HTMLElement>('article')
      const step = project
        ? project.getBoundingClientRect().width + 20
        : rail.clientWidth * 0.8
      rail.scrollBy({
        left: step * (event.key === 'ArrowRight' ? 1 : -1),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
    }
    if (event.key === 'Home') {
      event.preventDefault()
      rail.scrollTo({ left: 0, behavior: 'instant' })
    }
    if (event.key === 'End') {
      event.preventDefault()
      rail.scrollTo({ left: rail.scrollWidth, behavior: 'instant' })
    }
  }

  return (
    <>
      <RailTrack
        id="project-rail"
        ref={railRef}
        tabIndex={0}
        role="region"
        aria-label="Proyectos destacados"
        $dragging={drag.isDragging}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          railRef.current?.style.removeProperty('scroll-snap-type')
          drag.onPointerDown(event)
        }}
        onPointerMove={(event) => {
          drag.onPointerMove(event)
          moveCursor(event)
        }}
        onPointerLeave={hideCursor}
        onPointerUp={drag.onPointerEnd}
        onPointerCancel={(event) => {
          drag.onPointerEnd(event)
          hideCursor()
        }}
        onScroll={syncScrollbar}
        onWheel={() =>
          railRef.current?.style.removeProperty('scroll-snap-type')
        }
        onDragStart={(event) => event.preventDefault()}
      >
        <RailContent>
          {items.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectVisual
                $background={
                  project.visual.kind === 'css-mockup'
                    ? project.visual.background
                    : '#dce4e2'
                }
              >
                {project.visual.kind === 'image' ? (
                  <ProjectImage
                    src={project.visual.src}
                    alt={project.visual.alt}
                    width={project.visual.width}
                    height={project.visual.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <BrowserMock role="img" aria-label={project.visual.alt}>
                    <BrowserDots aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </BrowserDots>
                    <MockTitle aria-hidden="true">
                      {project.visual.title.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </MockTitle>
                  </BrowserMock>
                )}
              </ProjectVisual>
              <ProjectMeta>
                <div>
                  <small>{project.category}</small>
                  <h3>{project.name}</h3>
                </div>
                {hasProjectUrl(project.url) && (
                  <a
                    href={project.url}
                    aria-label={`Ver proyecto ${project.name}`}
                  >
                    Ver proyecto <Launch size={16} aria-hidden="true" />
                  </a>
                )}
              </ProjectMeta>
            </ProjectCard>
          ))}
        </RailContent>
      </RailTrack>
      <RailScrollbar
        ref={scrollbarRef}
        role="scrollbar"
        aria-label="Desplazamiento de proyectos"
        aria-controls="project-rail"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={0}
        onKeyDown={onScrollbarKeyDown}
        onPointerDown={onScrollbarPointerDown}
        onPointerMove={onScrollbarPointerMove}
        onPointerUp={onScrollbarPointerEnd}
        onPointerCancel={onScrollbarPointerEnd}
      >
        <RailScrollbarThumb ref={thumbRef} />
      </RailScrollbar>
      <RailCursor ref={cursorRef} aria-hidden="true" data-visible="false">
        <ArrowsHorizontal size={24} aria-hidden="true" />
      </RailCursor>
    </>
  )
}
