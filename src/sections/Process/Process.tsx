import {
  Container,
  DisplayHeading,
  Section,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { processSteps } from '../../data/process'
import { ProcessGrid, Step } from './Process.styles'

export function Process() {
  return (
    <Section id="proceso">
      <Container>
        <SectionHead>
          <div>
            <DisplayHeading>
              Claro desde el primer <span className="accent">paso.</span>
            </DisplayHeading>
            <SectionCopy>
              Sin llamadas innecesarias ni presupuestos ambiguos. El proyecto
              comienza cuando el alcance, el material y la seña están
              confirmados.
            </SectionCopy>
          </div>
        </SectionHead>
        <ProcessGrid>
          {processSteps.map((step) => (
            <Step key={step.number}>
              <b>{step.number}</b>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </Step>
          ))}
        </ProcessGrid>
      </Container>
    </Section>
  )
}
