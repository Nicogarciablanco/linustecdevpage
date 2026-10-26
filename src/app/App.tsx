import { useState } from 'react'
import { Header } from '../components/layout/Header/Header'
import { Footer } from '../components/layout/Footer/Footer'
import { plans } from '../data/plans'
import { PlanConfigurator } from '../features/plan-configurator/PlanConfigurator'
import { useStickyHeader } from '../hooks/useStickyHeader'
import { Hero } from '../sections/Hero/Hero'
import { Projects } from '../sections/Projects/Projects'
import { Plans } from '../sections/Plans/Plans'
import { Contact } from '../sections/Contact/Contact'
import type { PlanId } from '../types/plan'

export function App() {
  const [trigger, setTrigger] = useState<HTMLDivElement | null>(null)
  const sticky = useStickyHeader(trigger)
  const [selectedId, setSelectedId] = useState<PlanId | null>(null)
  const [entry, setEntry] = useState<'base' | 'customize'>('customize')
  const [opener, setOpener] = useState<HTMLButtonElement | null>(null)
  const selectedPlan = plans.find((plan) => plan.id === selectedId)

  return (
    <>
      <Header sticky={sticky} />
      <main>
        <Hero sticky={sticky} />
        <div ref={setTrigger} style={{ height: 1 }} aria-hidden="true" />
        <Projects />
        <Plans
          selectedId={selectedId}
          onSelect={(id, button, nextEntry) => {
            setOpener(button)
            setEntry(nextEntry)
            setSelectedId(id)
          }}
        />
        <Contact />
      </main>
      <Footer />
      {selectedPlan && (
        <PlanConfigurator
          key={selectedPlan.id}
          plan={selectedPlan}
          entry={entry}
          opener={opener}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
