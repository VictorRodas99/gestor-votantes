import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import Button from '@mui/material/Button'
import type { WizardStepProps } from '../../types/wizard'
import FamiliarFields from './familiar-fields'
import FormField from './form-field'
import IncFields from './inc-fields'
import SectionTitle from './section-title'
import VotanteActualCard from './votante-actual-card'

const GUIA_CAMPO = [
  'Confirme si el votante requiere transporte el día de la jornada.',
  'Anote cualquier cambio de domicilio o número de teléfono.'
]

export default function StepDatosVisita({
  onPrevious,
  onSubmit,
  isSubmitting
}: WizardStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-8 lg:rounded-xl lg:border lg:border-divider lg:bg-surface-container-lowest lg:p-6">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <SectionTitle>Detalles de la Visita</SectionTitle>

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-3">
            {/*
            <FormField
              name="encargado_visita"
              label="Encargado visita"
              placeholder="Nombre del encargado"
            />
            */}
            <FormField
              name="fecha_visita"
              label="Fecha de visita"
              type="date"
            />
            <FormField
              name="tipo_visita"
              label="Tipo de visita"
              placeholder="Ej: Presencial"
            />
          </div>

          <FormField
            name="observacion"
            label="Observación"
            placeholder="Detalles adicionales o notas importantes…"
            multiline
            minRows={4}
          />

          <FamiliarFields />
          <IncFields />
        </div>

        <aside className="hidden lg:col-span-5 lg:block">
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <VotanteActualCard />

            <div className="flex flex-col gap-3 rounded-lg border border-divider bg-surface-container-low p-4">
              <span className="flex items-center gap-2 text-label-md font-semibold text-secondary-dark">
                <TipsAndUpdatesRoundedIcon fontSize="small" />
                Guía de Campo
              </span>
              <ul className="flex flex-col gap-2">
                {GUIA_CAMPO.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-label-md text-text-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex gap-3 lg:justify-between lg:border-t lg:border-divider lg:pt-5">
        {onPrevious && (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onPrevious}
            startIcon={<ArrowBackRoundedIcon />}
            className="lg:w-auto lg:min-w-40 lg:flex-none"
          >
            Anterior
          </Button>
        )}
        <Button
          variant="contained"
          size="large"
          fullWidth
          loading={isSubmitting}
          loadingPosition="start"
          onClick={onSubmit}
          startIcon={<CheckCircleRoundedIcon />}
          className="lg:w-auto lg:min-w-40 lg:flex-none"
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
