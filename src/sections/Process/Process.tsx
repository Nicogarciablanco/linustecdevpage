import {
  DisplayHeading,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { planContent } from '../../data/plans'
import { ProcessBlock, ProcessGrid, Step } from './Process.styles'

export function Process() {
  return (
    <ProcessBlock id="proceso">
      <SectionHead>
        <div>
          <DisplayHeading>
            {planContent.processHeading}{' '}
            <span className="accent">{planContent.processHeadingAccent}</span>
          </DisplayHeading>
          <SectionCopy>{planContent.processIntroduction}</SectionCopy>
        </div>
      </SectionHead>
      <ProcessGrid>
        {planContent.processSteps.map((step) => (
          <Step key={step.number}>
            <b>{step.number}</b>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </Step>
        ))}
      </ProcessGrid>
    </ProcessBlock>
  )
}
