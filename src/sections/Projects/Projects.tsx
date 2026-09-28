import {
  Container,
  DisplayHeading,
  SectionCopy,
} from '../../components/ui/Layout'
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
            <SectionCopy>
              Proyectos creados para resolver necesidades concretas: presentar
              una marca, organizar información y hacer más fácil que el cliente
              avance.
            </SectionCopy>
          </div>
          <ButtonLink href="#planes">Elegí tu plan →</ButtonLink>
        </ProjectsHeader>
        <ProjectRail />
      </Container>
    </ProjectsSection>
  )
}
