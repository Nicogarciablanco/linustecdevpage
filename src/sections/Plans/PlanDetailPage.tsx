import { ArrowRight } from '@carbon/icons-react'
import { useState } from 'react'
import styled from 'styled-components'
import { Footer } from '../../components/layout/Footer/Footer'
import { Container } from '../../components/ui/Layout'
import { formatPrice, planContent } from '../../data/plans'
import { PlanConfigurator } from '../../features/plan-configurator/PlanConfigurator'
import type { Plan } from '../../types/plan'
import { PlanButton } from './Plans.styles'

const Detail = styled.main`
  min-height: 100vh;
  padding: clamp(32px, 5vw, 70px) 0;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  .back {
    color: ${({ theme }) => theme.colors.tealText};
    font-weight: 700;
  }
  h1,
  h2 {
    color: ${({ theme }) => theme.colors.ink};
    font-family: ${({ theme }) => theme.fonts.title};
    text-transform: uppercase;
  }
  h1 {
    max-width: 850px;
    margin: 42px 0 16px;
    font-size: clamp(42px, 6vw, 82px);
    line-height: 0.95;
  }
  h2 {
    margin: 0 0 16px;
    font-size: clamp(27px, 3vw, 38px);
  }
  .intro {
    max-width: 750px;
    line-height: 1.65;
  }
  .price {
    font-size: 30px;
    font-weight: 800;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    max-width: 510px;
    margin: 24px 0 42px;
  }
  .actions button {
    width: auto;
    min-width: 190px;
  }
  .sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  section {
    min-width: 0;
    padding: clamp(20px, 3vw, 32px);
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.page};
  }
  ul,
  ol {
    padding-left: 20px;
  }
  li {
    margin-bottom: 15px;
    line-height: 1.5;
  }
  li p {
    margin: 4px 0 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  .note {
    margin-top: 20px;
    line-height: 1.6;
  }
  @media (max-width: 700px) {
    .actions button {
      width: 100%;
    }
  }
`

export function PlanDetailPage({ plan }: { plan: Plan }) {
  const [openConfigurator, setOpenConfigurator] = useState(false)
  const [opener, setOpener] = useState<HTMLButtonElement | null>(null)
  function open(button: HTMLButtonElement) {
    setOpener(button)
    setOpenConfigurator(true)
  }
  return (
    <>
      <Detail>
        <Container>
          <a className="back" href="/#planes">
            ← {planContent.detailBack}
          </a>
          <h1>{plan.label}</h1>
          <p className="intro">{plan.summary}</p>
          <p className="price">{formatPrice(plan.price)}</p>
          <div className="actions">
            {plan.id === 'medida' ? (
              <PlanButton
                type="button"
                onClick={(event) => open(event.currentTarget)}
              >
                {planContent.customAction}{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </PlanButton>
            ) : (
              <PlanButton
                type="button"
                onClick={(event) => open(event.currentTarget)}
              >
                {planContent.baseAction}{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </PlanButton>
            )}
          </div>
          <div className="sections">
            <section>
              <h2>{plan.inclusionLabel}</h2>
              <ul>
                {plan.inclusions.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{planContent.extrasLabel}</h2>
              {plan.extras.length ? (
                <ul>
                  {plan.extras.map((extra) => (
                    <li key={extra.id}>
                      <strong>
                        {extra.name} · {formatPrice(extra.price)}
                      </strong>
                      <p>{extra.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{plan.boundary}</p>
              )}
            </section>
            <section>
              <h2>{planContent.detailScope}</h2>
              <p>{plan.boundary}</p>
            </section>
          </div>
        </Container>
      </Detail>
      <Footer />
      {openConfigurator && (
        <PlanConfigurator
          plan={plan}
          opener={opener}
          onClose={() => setOpenConfigurator(false)}
        />
      )}
    </>
  )
}
