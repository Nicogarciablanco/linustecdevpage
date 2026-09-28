export type PlanId = 'gastronomica' | 'institucional' | 'personalizado'
export interface PlanOption {
  name: string
  description: string
}
export interface Plan {
  id: PlanId
  number: string
  label: string
  headline: string
  audience: string
  features: string[]
  title: string
  copy: string
  options: PlanOption[]
  featured?: boolean
}
