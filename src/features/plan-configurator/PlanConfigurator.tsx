import { ArrowRight, Close } from '@carbon/icons-react'
import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { PrimaryButton } from '../../components/ui/Button'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import type { Plan } from '../../types/plan'
import {
  CheckGrid,
  CheckOption,
  ChecksLabel,
  CloseButton,
  Dialog,
  DialogBottom,
  DialogContent,
  DialogCopy,
  DialogTitle,
  DialogTop,
} from './PlanConfigurator.styles'

export function PlanConfigurator({
  plan,
  opener,
  onClose,
}: {
  plan: Plan
  opener: HTMLButtonElement | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyScrollLock(true)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    closeRef.current?.focus()
    return () => {
      if (dialog?.open) dialog.close()
      opener?.focus()
    }
  }, [opener])

  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <Dialog
      id="plan-dialog"
      ref={dialogRef}
      aria-labelledby="plan-dialog-title"
      onClick={onBackdropClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <DialogContent>
        <DialogTop>
          <div>
            <p>Configurá tu solución</p>
            <DialogTitle id="plan-dialog-title">{plan.title}</DialogTitle>
          </div>
          <CloseButton
            ref={closeRef}
            type="button"
            aria-label="Cerrar configurador"
            onClick={onClose}
          >
            <Close size={20} aria-hidden="true" />
          </CloseButton>
        </DialogTop>
        <DialogCopy>{plan.copy}</DialogCopy>
        <ChecksLabel>Podés sumar lo que necesites</ChecksLabel>
        <CheckGrid>
          {plan.options.map((option, index) => (
            <CheckOption key={option.name}>
              <input
                type="checkbox"
                name={plan.id}
                value={option.name}
                id={`${plan.id}-${index}`}
              />
              <span>
                <strong>{option.name}</strong>
                <small>{option.description}</small>
              </span>
            </CheckOption>
          ))}
        </CheckGrid>
        <DialogBottom>
          <p>
            Esta selección es una primera configuración. El alcance final se
            confirma antes de iniciar el proyecto.
          </p>
          <PrimaryButton type="button" onClick={onClose}>
            Guardar selección <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
        </DialogBottom>
      </DialogContent>
    </Dialog>
  )
}
