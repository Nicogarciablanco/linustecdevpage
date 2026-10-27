import { useState } from 'react'
import { Header } from '../components/layout/Header/Header'
import { Footer } from '../components/layout/Footer/Footer'
import { plans } from '../data/plans'
import { PlanConfigurator } from '../features/plan-configurator/PlanConfigurator'
import { useStickyHeader } from '../hooks/useStickyHeader'
import { Hero } from '../sections/Hero/Hero'
import { Projects } from '../sections/Projects/Projects'
import { Plans } from '../sections/Plans/Plans'
import { PlanDetailPage } from '../sections/Plans/PlanDetailPage'
import { Contact } from '../sections/Contact/Contact'
import type { PlanId } from '../types/plan'

export function App() {
  const detailPlan = plans.find(
    (plan) => window.location.pathname === `/planes/${plan.id}`,
  )
  return detailPlan ? <PlanDetailPage plan={detailPlan} /> : <Home />
}

function Home() {
  const [trigger, setTrigger] = useState<HTMLDivElement | null>(null)
  const sticky = useStickyHeader(trigger)
  const [selectedId, setSelectedId] = useState<PlanId | null>(null)
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
          onSelect={(id, button) => {
            setOpener(button)
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
          opener={opener}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
