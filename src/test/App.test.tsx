import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
  cleanup,
  act,
} from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Profiler } from 'react'
import { App } from '../app/App'
import { GlobalStyles } from '../app/styles/GlobalStyles'
import { theme } from '../app/styles/theme'
import { projects } from '../data/projects'
import { ProjectRail } from '../features/project-rail/ProjectRail'

let observerCallback: IntersectionObserverCallback
let observerOptions: IntersectionObserverInit | undefined
const scrollBy = vi.fn()
const scrollTo = vi.fn()

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observerCallback = callback
        observerOptions = options
      }
      observe = vi.fn()
      disconnect = vi.fn()
    },
  )
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
    configurable: true,
    value: scrollBy,
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: scrollTo,
  })
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    configurable: true,
    value: vi.fn(),
  })
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    configurable: true,
    value: vi.fn().mockReturnValue(true),
  })
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    configurable: true,
    value: vi.fn(),
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open')
    },
  })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  scrollBy.mockClear()
  scrollTo.mockClear()
})

function setup() {
  return render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>,
  )
}
function openPlan(index: number) {
  fireEvent.click(
    screen.getAllByRole('button', { name: 'Configurar plan →' })[index]!,
  )
}

describe('landing', () => {
  it('renders reference structure with one h1 and no theme control', () => {
    setup()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Trabajo que habla por nosotros.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Hagamos una web/ }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /tema|modo oscuro/i }),
    ).not.toBeInTheDocument()
    expect(window.matchMedia).not.toHaveBeenCalledWith(
      expect.stringContaining('prefers-color-scheme'),
    )
  })
  it('keeps one header node and width while CTA accessibility changes', async () => {
    setup()
    const header = document.querySelector('header')!
    const parent = header.parentElement
    const width = getComputedStyle(header).width
    const actions = header.querySelector('[aria-hidden]')!
    const headerLinks = within(header)
      .getAllByRole('link', { hidden: true })
      .filter(
        (link) =>
          link.textContent?.includes('Ver planes') ||
          link.textContent?.includes('Explorar proyectos'),
      )
    expect(width).not.toBe('')
    expect(actions).toHaveAttribute('aria-hidden', 'true')
    expect(headerLinks.every((link) => link.tabIndex === -1)).toBe(true)
    expect(getComputedStyle(actions).visibility).toBe('hidden')
    expect(observerOptions?.rootMargin).toBe('-112px 0px 0px 0px')
    expect(screen.getAllByRole('link', { name: 'Ver planes ↗' })).toHaveLength(
      1,
    )
    act(() =>
      observerCallback(
        [{ boundingClientRect: { top: 104 } } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    )
    await waitFor(() => expect(header).toHaveAttribute('data-sticky', 'true'))
    expect(document.querySelector('header')).toBe(header)
    expect(header.parentElement).toBe(parent)
    expect(getComputedStyle(header).width).toBe(width)
    expect(actions).toHaveAttribute('aria-hidden', 'false')
    expect(getComputedStyle(actions).visibility).toBe('visible')
    expect(headerLinks.every((link) => link.tabIndex === 0)).toBe(true)
    expect(screen.getAllByRole('link', { name: 'Ver planes ↗' })).toHaveLength(
      1,
    )
  })
  it('aligns the hero aside to the title base on desktop', () => {
    setup()
    const aside = screen.getByText(
      /Diseñamos y desarrollamos experiencias/,
    ).parentElement!
    expect(getComputedStyle(aside).alignSelf).toBe('end')
  })
  it('combines the projects heading, CTA, and rail in one section', () => {
    setup()
    const section = document.querySelector<HTMLElement>('#trabajos')!
    expect(section).toBeInTheDocument()
    expect(document.querySelector('#projects-rail')).not.toBeInTheDocument()
    expect(
      within(section).getByRole('heading', {
        name: 'Trabajo que habla por nosotros.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Diseño que se ve/ }),
    ).not.toBeInTheDocument()
    expect(
      within(section).getByRole('link', {
        name: 'Elegí tu plan →',
      }),
    ).toHaveAttribute('href', '#planes')
    expect(
      within(document.querySelector('header')!).getByRole('link', {
        name: 'Proyectos',
      }),
    ).toHaveAttribute('href', '#trabajos')
    expect(
      screen.queryByRole('button', {
        name: /Ver proyectos (anteriores|siguientes)/,
      }),
    ).not.toBeInTheDocument()
  })
  it('renders four projects in order without an invented Agrorepuestos URL', () => {
    setup()
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const cards = within(rail).getAllByRole('article')
    expect(cards).toHaveLength(4)
    expect(
      cards.map(
        (card) => within(card).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual(['Montañita', 'Estudio Paz', 'Agrorepuestos', 'RHEA'])
    expect(within(cards[2]!).queryByRole('link')).not.toBeInTheDocument()
    expect(rail).toHaveAttribute('tabindex', '0')
    expect(document.querySelectorAll('a[href="#"]')).toHaveLength(0)
  })
  it('moves the rail by keyboard and mouse drag', () => {
    setup()
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    fireEvent.keyDown(rail, { key: 'ArrowRight' })
    expect(scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: expect.any(Number) }),
    )
    fireEvent.pointerDown(rail, {
      pointerType: 'mouse',
      button: 0,
      clientX: 200,
      pointerId: 1,
    })
    fireEvent.pointerMove(rail, {
      pointerType: 'mouse',
      clientX: 100,
      pointerId: 1,
    })
    expect(rail.scrollLeft).toBe(100)
    fireEvent.pointerUp(rail, { pointerType: 'mouse', pointerId: 1 })
  })
  it('syncs the draggable scrollbar with the rail position', () => {
    setup()
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const scrollbar = screen.getByRole('scrollbar', {
      name: 'Desplazamiento de proyectos',
    })
    const thumb = scrollbar.firstElementChild as HTMLElement
    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 1000 },
      scrollWidth: { configurable: true, value: 1500 },
    })
    Object.defineProperty(scrollbar, 'clientWidth', {
      configurable: true,
      value: 900,
    })
    rail.scrollLeft = 250
    fireEvent.scroll(rail)
    expect(scrollbar).toHaveAttribute('aria-controls', 'project-rail')
    expect(scrollbar).toHaveAttribute('aria-valuenow', '50')
    expect(parseFloat(thumb.style.width)).toBeCloseTo(495)
    expect(
      parseFloat(
        thumb.style.transform.match(/translate3d\(([^p]+)/)?.[1] ?? '0',
      ),
    ).toBeCloseTo(202.5)
    fireEvent.keyDown(scrollbar, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 500 })
  })
  it('shows the cursor only over mouse-hovered card content', () => {
    render(
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ProjectRail
          items={[{ ...projects[0]!, url: 'https://example.com' }]}
        />
      </ThemeProvider>,
    )
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const card = within(rail).getAllByRole('article')[0]!
    const cursor = document.querySelector<HTMLElement>('[data-visible]')!
    expect(cursor).toHaveAttribute('aria-hidden', 'true')
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 210,
      clientY: 320,
    })
    expect(cursor).toHaveAttribute('data-visible', 'true')
    expect(cursor.style.transform).toBe(
      'translate3d(210px, 320px, 0) translate(-50%, -50%)',
    )
    fireEvent.pointerMove(within(card).getByRole('link'), {
      pointerType: 'mouse',
      clientX: 220,
      clientY: 330,
    })
    expect(cursor).toHaveAttribute('data-visible', 'false')
    fireEvent.pointerMove(card, { pointerType: 'touch', clientX: 210 })
    expect(cursor).toHaveAttribute('data-visible', 'false')
  })
  it('does not render React again for pointer movement over a card', () => {
    let renders = 0
    render(
      <ThemeProvider theme={theme}>
        <Profiler id="project-rail" onRender={() => renders++}>
          <ProjectRail />
        </Profiler>
      </ThemeProvider>,
    )
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const card = within(rail).getAllByRole('article')[0]!
    const initialRenders = renders
    for (let index = 0; index < 30; index++) {
      fireEvent.pointerMove(card, {
        pointerType: 'mouse',
        clientX: 200 + index,
        clientY: 300,
      })
    }
    expect(renders).toBe(initialRenders)
  })
  it('keeps one pending cursor frame and cancels it when the pointer leaves', () => {
    const frames: FrameRequestCallback[] = []
    const schedule = vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    const cancel = vi.fn()
    vi.stubGlobal('requestAnimationFrame', schedule)
    vi.stubGlobal('cancelAnimationFrame', cancel)
    render(
      <ThemeProvider theme={theme}>
        <ProjectRail />
      </ThemeProvider>,
    )
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const card = within(rail).getAllByRole('article')[0]!
    const cursor = document.querySelector<HTMLElement>('[data-visible]')!
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 210,
      clientY: 300,
    })
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 240,
      clientY: 320,
    })
    expect(schedule).toHaveBeenCalledTimes(1)
    frames[0]!(0)
    expect(cursor.style.transform).toBe(
      'translate3d(240px, 320px, 0) translate(-50%, -50%)',
    )
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 260,
      clientY: 330,
    })
    fireEvent.pointerLeave(rail)
    expect(cancel).toHaveBeenCalledWith(2)
    expect(cursor).toHaveAttribute('data-visible', 'false')
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 280,
      clientY: 340,
    })
    cleanup()
    expect(cancel).toHaveBeenCalledWith(3)
  })
  it('keeps both rail extremes reachable with a five-project test fixture', () => {
    const fiveProjects = [
      ...projects,
      { ...projects[3]!, id: 'rhea-qa-fixture', name: 'RHEA QA' },
    ]
    render(
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ProjectRail items={fiveProjects} />
      </ThemeProvider>,
    )
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const cards = within(rail).getAllByRole('article')
    Object.defineProperty(rail, 'scrollWidth', {
      configurable: true,
      value: 1900,
    })
    expect(cards).toHaveLength(5)
    expect(
      within(cards[0]!).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Montañita')
    expect(
      within(cards[4]!).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('RHEA QA')
    expect(projects).toHaveLength(4)
    fireEvent.keyDown(rail, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 1900,
      behavior: 'instant',
    })
    fireEvent.keyDown(rail, { key: 'Home' })
    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 0,
      behavior: 'instant',
    })
  })
  it('uses instant keyboard scrolling when reduced motion is requested', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    setup()
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    fireEvent.keyDown(rail, { key: 'ArrowRight' })
    expect(scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'instant' }),
    )
  })
  it.each([
    [0, 'Plan gastronómico', 'Carta QR'],
    [1, 'Plan institucional', 'Galería de trabajos'],
    [2, 'Plan a medida', 'Segundo idioma'],
  ])('opens correct configurator for plan %i', (index, title, check) => {
    setup()
    openPlan(index)
    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole('heading', { name: title }),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('checkbox', { name: new RegExp(check) }),
    ).toBeInTheDocument()
  })
  it('closes with X and restores focus', async () => {
    setup()
    const opener = screen.getAllByRole('button', {
      name: 'Configurar plan →',
    })[0]!
    opener.focus()
    fireEvent.click(opener)
    expect(
      screen.getByRole('button', { name: 'Cerrar configurador' }),
    ).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar configurador' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })
  it('closes with Escape and backdrop', () => {
    setup()
    openPlan(0)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    openPlan(1)
    fireEvent.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
