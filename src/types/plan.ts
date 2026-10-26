export type PlanId = 'gastronomico' | 'servicios' | 'institucional' | 'medida'

export type Price =
  | { status: 'pending' }
  | { status: 'quote' }
  | { status: 'defined'; amount: number }

export interface PlanInclusion {
  title: string
  description: string
}

export interface PlanChoice {
  id: string
  name: string
  description?: string
}

export interface PlanExtra extends PlanChoice {
  description: string
  price: Price
}

export interface Plan {
  id: PlanId
  number: string
  label: string
  headline: string
  audience: string
  name: string
  summary: string
  inclusionLabel: string
  inclusions: PlanInclusion[]
  boundaryLabel: string
  boundary: string
  material: string[]
  price: Price
  choices: PlanChoice[]
  choiceMode: 'single' | 'multiple'
  defaultChoices: string[]
  extras: PlanExtra[]
}

export type DomainStatus = 'register' | 'owned' | 'later'

export interface RequestContact {
  name: string
  business: string
  email: string
  phone: string
  message: string
  domain: DomainStatus
}

export interface PlanRequestDraft {
  planId: PlanId
  selectedChoiceIds: string[]
  selectedExtraIds: string[]
  contact: RequestContact
  status: 'draft'
}
