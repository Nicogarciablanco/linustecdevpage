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
import { coupons, planContent, plans } from '../data/plans'
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
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('No consultation request expected')
    }),
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  scrollBy.mockClear()
  scrollTo.mockClear()
  coupons.splice(0)
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
    screen.getAllByRole('button', { name: 'Comprar ahora' })[index]!,
  )
}
function openPlanOptions(index: number) {
  openPlan(index)
  fireEvent.click(screen.getByRole('button', { name: 'Agregar extras' }))
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
    const trigger = document.querySelector<HTMLElement>(
      'main > div[aria-hidden="true"]',
    )!
    let triggerTop = 900
    vi.spyOn(trigger, 'getBoundingClientRect').mockImplementation(
      () => ({ top: triggerTop }) as DOMRect,
    )
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
    expect(screen.getAllByRole('link', { name: 'Ver planes' })).toHaveLength(1)
    vi.stubGlobal('scrollY', 800)
    triggerTop = 104
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
    expect(screen.getAllByRole('link', { name: 'Ver planes' })).toHaveLength(1)
    vi.stubGlobal('scrollY', 0)
    triggerTop = 900
    act(() => fireEvent.scroll(window))
    await waitFor(() => expect(header).toHaveAttribute('data-sticky', 'false'))
    expect(actions).toHaveAttribute('aria-hidden', 'true')
    expect(headerLinks.every((link) => link.tabIndex === -1)).toBe(true)
    expect(
      document.querySelector('#inicio a[href="#planes"]'),
    ).toBeInTheDocument()
    act(() =>
      observerCallback(
        [{ boundingClientRect: { top: 104 } } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    )
    expect(header).toHaveAttribute('data-sticky', 'false')
  })
  it('resyncs the header after resize and browser history events', () => {
    setup()
    const header = document.querySelector('header')!
    const trigger = document.querySelector<HTMLElement>(
      'main > div[aria-hidden="true"]',
    )!
    let triggerTop = 900
    vi.spyOn(trigger, 'getBoundingClientRect').mockImplementation(
      () => ({ top: triggerTop }) as DOMRect,
    )
    for (const [eventName, scrollPosition, top, sticky] of [
      ['resize', 800, 104, 'true'],
      ['pageshow', 0, 900, 'false'],
      ['hashchange', 800, 104, 'true'],
      ['popstate', 0, 900, 'false'],
    ] as const) {
      vi.stubGlobal('scrollY', scrollPosition)
      triggerTop = top
      act(() => window.dispatchEvent(new Event(eventName)))
      expect(header).toHaveAttribute('data-sticky', sticky)
    }
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
        name: 'Elegí tu plan',
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
  it('keeps Carbon icons decorative at their intended sizes', () => {
    setup()
    const plansLink = screen.getByRole('link', { name: 'Ver planes' })
    const contactLink = screen.getByRole('link', {
      name: 'Contame tu proyecto',
    })
    const cardArrows = document.querySelectorAll('#planes article button > svg')
    const cursorIcon = document.querySelector('[data-visible] svg')
    expect(plansLink.querySelector('svg')).toHaveAttribute('width', '16')
    expect(contactLink.querySelector('svg')).toHaveAttribute('width', '16')
    expect(cardArrows).toHaveLength(3)
    expect(
      [...cardArrows].every(
        (icon) =>
          icon.getAttribute('width') === '16' &&
          icon.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
    expect(cursorIcon).toHaveAttribute('width', '24')
    expect(cursorIcon).toHaveAttribute('aria-hidden', 'true')
    openPlan(0)
    const close = screen.getByRole('button', { name: 'Cerrar configurador' })
    expect(close.querySelector('svg')).toHaveAttribute('width', '20')
    expect(close.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
  it('renders projects with their names and destination links', () => {
    setup()
    const rail = screen.getByRole('region', { name: 'Proyectos destacados' })
    const cards = within(rail).getAllByRole('article')
    expect(cards).toHaveLength(4)
    expect(
      cards.map(
        (card) => within(card).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual(['Montañita', 'Estudio Jurídico Paz', 'Agrorepuestos', 'RHEA'])
    expect(
      cards.map((card) => within(card).getByRole('link').getAttribute('href')),
    ).toEqual([
      'https://xn--montaita-h3a.com.ar/',
      'https://estudiojuridicopaz.com.ar/',
      'https://agrorepuestos-v2-0.vercel.app/',
      'https://rhea-v2-0.vercel.app/',
    ])
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
    expect(rail).not.toHaveAttribute('data-cursor-active', 'true')
    fireEvent.pointerMove(card, {
      pointerType: 'mouse',
      clientX: 210,
      clientY: 320,
    })
    expect(cursor).toHaveAttribute('data-visible', 'true')
    expect(rail).toHaveAttribute('data-cursor-active', 'true')
    expect(cursor.style.transform).toBe(
      'translate3d(210px, 320px, 0) translate(-50%, -50%)',
    )
    fireEvent.pointerMove(within(card).getByRole('link'), {
      pointerType: 'mouse',
      clientX: 220,
      clientY: 330,
    })
    expect(cursor).toHaveAttribute('data-visible', 'true')
    expect(rail).toHaveAttribute('data-cursor-active', 'true')
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
  it('shows four comparable plans, their detail pages and neutral card cursors', () => {
    setup()
    const cards = [
      ...document.querySelectorAll<HTMLElement>(
        '#planes article[aria-labelledby="plan-title-gastronomico"], #planes article[aria-labelledby="plan-title-servicios"], #planes article[aria-labelledby="plan-title-institucional"], #planes article[aria-labelledby="plan-title-medida"]',
      ),
    ]
    expect(cards).toHaveLength(4)
    expect(
      cards.every((card) => getComputedStyle(card).cursor === 'default'),
    ).toBe(true)
    expect(
      screen.getAllByRole('button', { name: 'Comprar ahora' }),
    ).toHaveLength(3)
    expect(
      screen.queryByRole('button', { name: 'Personalizar plan' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: '¿Querés saber más?' }),
    ).toHaveLength(4)
    expect(plans.map((plan) => plan.price)).toEqual([
      { status: 'defined', amount: 220000 },
      { status: 'defined', amount: 300000 },
      { status: 'defined', amount: 180000 },
      { status: 'quote' },
    ])
    expect(cards[0]).toHaveTextContent('220.000')
    expect(cards[1]).toHaveTextContent('300.000')
    expect(cards[2]).toHaveTextContent('180.000')
    expect(cards[3]).toHaveTextContent('A cotizar')
    expect(
      document.querySelector('#planes #proceso article'),
    ).toBeInTheDocument()
  })
  it.each(plans)('opens $label only from its action button', (plan) => {
    setup()
    const card = screen.getByRole('article', { name: plan.headline })
    fireEvent.click(card)
    fireEvent.click(within(card).getByRole('heading', { name: plan.headline }))
    fireEvent.click(within(card).getByText(plan.audience))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(
      within(card).getByRole('button', {
        name:
          plan.id === 'medida'
            ? planContent.customAction
            : planContent.baseAction,
      }),
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
  it('asks about extras before contact and shows the base total and deposit', async () => {
    setup()
    openPlan(0)
    expect(
      screen.getByRole('heading', { name: planContent.extrasPrompt }),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Tu nombre')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Seguir sin extras' }))
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('220.000')
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('110.000')
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent(
      planContent.depositNote,
    )
    expect(screen.getByLabelText('Tu selección')).not.toHaveTextContent(
      planContent.subtotalLabel,
    )
    expect(screen.getByText(planContent.paymentAlias)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    expect(screen.getByLabelText('Tu nombre')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Comprobante de la transferencia'),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Enlace al material'),
    ).not.toBeInTheDocument()
  })
  it('applies a configured coupon only after Aplicar, without API requests', () => {
    coupons.push({ code: 'TEST10', type: 'percent', value: 10 })
    setup()
    openPlan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Seguir sin extras' }))
    const fetcher = vi.mocked(fetch)
    fireEvent.change(screen.getByLabelText('Cupón de descuento'), {
      target: { value: 'TEST10' },
    })
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('110.000')
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('198.000')
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('99.000')
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('rejects an unknown coupon while keeping the base budget available', () => {
    setup()
    openPlan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Seguir sin extras' }))
    fireEvent.change(screen.getByLabelText('Cupón de descuento'), {
      target: { value: 'UNKNOWN' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      planContent.couponInvalid,
    )
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('110.000')
    expect(
      screen.getByRole('button', { name: 'Completar solicitud' }),
    ).toBeEnabled()
    expect(fetch).not.toHaveBeenCalled()
  })
  it.each([
    [0, 'Plan gastronómico', 'Reservas de mesas'],
    [1, 'Servicios y reservas', 'Panel autoadministrable sin carga de fotos'],
    [
      2,
      'Presentación institucional',
      'Panel autoadministrable sin carga de fotos',
    ],
  ])('opens the correct options for plan %i', (index, title, extra) => {
    setup()
    openPlanOptions(index)
    expect(screen.getByRole('dialog')).toHaveTextContent(title)
    expect(
      screen.getByRole('checkbox', { name: new RegExp(extra) }),
    ).toBeInTheDocument()
  })
  it('replaces, rather than accumulates, exclusive table reservation variants', () => {
    setup()
    openPlanOptions(0)
    const basic = screen.getByRole('checkbox', { name: /^Reservas de mesas/ })
    const selected = screen.getByRole('checkbox', {
      name: /Reservas con elección de mesa/,
    })
    fireEvent.click(basic)
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('380.000')
    fireEvent.click(selected)
    expect(basic).not.toBeChecked()
    expect(selected).toBeChecked()
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('480.000')
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('240.000')
  })
  it('only offers extras with a defined price', () => {
    setup()
    openPlanOptions(0)
    expect(
      screen.queryByText('Carga inicial adicional'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Galería de fotos')).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('dialog')).queryByText('A cotizar'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /Reservas de mesas/ }),
    ).toBeEnabled()
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('220.000')
  })
  it('requires a receipt for a priced plan while A medida stays a quote', async () => {
    setup()
    openPlan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Seguir sin extras' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Completar solicitud' }),
      ).toBeEnabled(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    for (const [label, value] of [
      ['Tu nombre', 'Nicolás Pérez'],
      ['Correo electrónico', 'nico@example.com'],
      ['WhatsApp', '11 5555 4444'],
    ] as const)
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
    expect(screen.getByText(planContent.form.receipt.error)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar configurador' }))
    fireEvent.click(screen.getByRole('button', { name: 'Consultar proyecto' }))
    expect(screen.getByLabelText('¿Qué necesitás?')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Comprobante de la transferencia'),
    ).not.toBeInTheDocument()
  })
  it('resets incompatible selections when another plan opens', () => {
    setup()
    openPlanOptions(0)
    fireEvent.click(
      screen.getByRole('checkbox', { name: /^Reservas de mesas/ }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar configurador' }))
    openPlanOptions(1)
    expect(
      screen.queryByRole('checkbox', { name: /^Reservas de mesas/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: /Panel autoadministrable sin carga de fotos/,
      }),
    ).not.toBeChecked()
  })
  it('keeps extras and contact data when moving back through a priced request', async () => {
    setup()
    openPlanOptions(0)
    fireEvent.click(
      screen.getByRole('checkbox', { name: /^Reservas de mesas/ }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Completar solicitud' }),
      ).toBeEnabled(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    fireEvent.change(screen.getByLabelText('Tu nombre'), {
      target: { value: 'Nicolás Pérez' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('380.000')
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(
      screen.getByRole('checkbox', { name: /^Reservas de mesas/ }),
    ).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Completar solicitud' }),
      ).toBeEnabled(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    expect(screen.getByLabelText('Tu nombre')).toHaveValue('Nicolás Pérez')
  })
  it('keeps A medida as a quote and disables sending without Turnstile', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Consultar proyecto' }))
    for (const [label, value] of [
      ['Tu nombre', 'Nicolás Pérez'],
      ['Negocio o actividad', 'Estudio Sur'],
      ['Correo electrónico', 'nico@example.com'],
      ['WhatsApp', '11 5555 4444'],
      ['¿Qué necesitás?', 'Un sistema particular.'],
    ] as const)
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('A cotizar')
    expect(screen.getByRole('dialog')).not.toHaveTextContent('Seña del 50 %')
    expect(
      screen.getByRole('button', { name: 'Enviar consulta' }),
    ).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent(
      planContent.submission.unavailable,
    )
  })
  it('closes when the backdrop is clicked', () => {
    setup()
    openPlan(0)
    fireEvent.click(screen.getByRole('dialog'), {
      clientX: -1,
      clientY: -1,
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('closes on button and Escape and restores focus', async () => {
    setup()
    const opener = screen.getAllByRole('button', { name: 'Comprar ahora' })[0]!
    opener.focus()
    fireEvent.click(opener)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar configurador' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(opener).toHaveFocus()
    openPlan(1)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
