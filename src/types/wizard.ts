/**
 * Contrato mínimo de un paso del wizard.
 * Todos los pasos leen/escriben el mismo form vía `useFormContext`.
 */
export type WizardStepProps = {
  onNext?: () => void
  onPrevious?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
}
