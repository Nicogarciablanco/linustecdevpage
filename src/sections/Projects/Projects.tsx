import { ArrowRight } from '@carbon/icons-react'
import { Container, DisplayHeading } from '../../components/ui/Layout'
import { ButtonLink } from '../../components/ui/Button'
import { ProjectRail } from '../../features/project-rail/ProjectRail'
import { ProjectsHeader, ProjectsSection } from './Projects.styles'

export function Projects() {
  return (
    <ProjectsSection id="trabajos" aria-labelledby="projects-title">
      <Container>
        <ProjectsHeader>
          <div>
            <DisplayHeading id="projects-title">
              Trabajo que habla por nosotros.
            </DisplayHeading>
          </div>
          <ButtonLink href="#planes">
            Elegí tu plan <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </ProjectsHeader>
        <ProjectRail />
      </Container>
    </ProjectsSection>
  )
}
