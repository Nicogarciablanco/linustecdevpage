export type ProjectVisual =
  | {
      kind: 'css-mockup'
      title: string[]
      background: string
      alt: string
    }
  | {
      kind: 'image'
      src: string
      alt: string
      width: number
      height: number
    }

export interface Project {
  id: string
  name: string
  category: string
  url?: string
  visual: ProjectVisual
}
