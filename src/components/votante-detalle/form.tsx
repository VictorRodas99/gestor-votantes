import { zodResolver } from '@hookform/resolvers/zod'
import Avatar from '@mui/material/Avatar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useEffect, useEffectEvent, useState } from 'react'
import { FormProvider, useForm, useFormState } from 'react-hook-form'
import { useBlocker, type Location } from 'react-router-dom'
import { toast } from 'sonner'
import { votanteAValoresDetalle } from '../../forms/votante/prefill'
import {
  wizardSchema,
  type WizardFormData
} from '../../forms/votante/wizard.schema'
import {
  useActualizarVotante,
  useAsegurarCelularLibre
} from '../../hooks/services/votantes'
import { formatCedula, getInitials } from '../../lib/format'
import type { Votante } from '../../types/votante'
import VotanteChips from '../votante-chips'
import { MENSAJE_CELULAR_TOMADO } from '../wizard/celular-field'
import {
  primerError,
  TAB,
  tabsConError,
  type TabDetalle
} from './campos-por-tab'
import DescartarCambiosDialog from './descartar-cambios-dialog'
import GuardarBarra from './guardar-barra'
import GuardarFab from './guardar-fab'
import TabDatosPersonales from './tab-datos-personales'
import TabVisita from './tab-visita'
import TabVotacion from './tab-votacion'

export type VarianteDetalle = 'panel' | 'dialog'

type VotanteDetalleFormProps = {
  votante: Votante
  variante: VarianteDetalle
}

const ciDe = (location: Location) =>
  new URLSearchParams(location.search).get('ci')

function TabLabel({ label, error }: { label: string; error: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      {error && (
        <span
          role="img"
          aria-label="Con errores"
          className="size-2 rounded-full bg-error"
        />
      )}
    </span>
  )
}

/**
 * Detalle editable de un votante: mismo schema y mismo POST que el wizard.
 * Se monta con `key={cedula}`, así cambiar de votante arranca un form nuevo.
 */
export default function VotanteDetalleForm({
  votante,
  variante
}: VotanteDetalleFormProps) {
  const [valoresIniciales] = useState(() => votanteAValoresDetalle(votante))
  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: 'onChange',
    defaultValues: valoresIniciales
  })
  const { isDirty, isSubmitting, errors } = useFormState({
    control: form.control
  })

  const [tab, setTab] = useState<TabDetalle>(TAB.votacion)
  const conError = tabsConError(errors)

  const actualizar = useActualizarVotante()
  const asegurarCelularLibre = useAsegurarCelularLibre()

  const guardar = form.handleSubmit(
    async (data) => {
      const libre = await asegurarCelularLibre(data.celular ?? '', data.cedula)
      if (!libre) {
        form.setError('celular', {
          type: 'celular-tomado',
          message: MENSAJE_CELULAR_TOMADO
        })
        setTab(TAB.personales)
        toast.error(MENSAJE_CELULAR_TOMADO)
        return
      }

      try {
        const { guardado } = await toast
          .promise(
            actualizar.mutateAsync({
              editado: data,
              inicial: form.formState.defaultValues ?? valoresIniciales
            }),
            {
              loading: 'Guardando votante…',
              success: ({ respuesta }) => respuesta.message,
              error: (reason) =>
                reason instanceof Error ? reason.message : 'Error al guardar'
            }
          )
          .unwrap()

        form.reset(guardado)
      } catch {
        // El toast ya mostró el error; el form conserva lo editado.
      }
    },
    (errores) => {
      // Sin esto el error puede quedar en una tab que no se está viendo y
      // Guardar parecería no hacer nada.
      const primero = primerError(errores)
      if (primero) setTab(primero.tab)
      toast.error(primero?.mensaje ?? 'Revisá los campos marcados')
    }
  )

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !isSubmitting &&
      (currentLocation.pathname !== nextLocation.pathname ||
        ciDe(currentLocation) !== ciDe(nextLocation))
  )

  useEffect(() => {
    if (!isDirty) return

    const avisar = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [isDirty])

  const alPresionarTecla = useEffectEvent((event: KeyboardEvent) => {
    if (event.key.toLowerCase() !== 's' || !(event.ctrlKey || event.metaKey))
      return

    // Sin esto el navegador abre "Guardar página".
    event.preventDefault()
    if (isDirty && !isSubmitting) guardar()
  })

  useEffect(() => {
    if (variante !== 'panel') return

    const escuchar = (event: KeyboardEvent) => alPresionarTecla(event)
    window.addEventListener('keydown', escuchar)
    return () => window.removeEventListener('keydown', escuchar)
  }, [variante])

  const esPanel = variante === 'panel'

  const contenido = (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 bg-primary text-body-md font-semibold text-white">
          {getInitials(votante.nombreCompleto)}
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-title-md truncate font-semibold text-text-primary">
            {votante.apellido.toUpperCase()}, {votante.nombre}
          </p>
          <p className="text-body-md text-text-secondary">
            CI {formatCedula(votante.cedula)}
          </p>
          <VotanteChips votante={votante} />
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={(_, value: TabDetalle) => setTab(value)}
        variant="fullWidth"
        className={
          esPanel ? 'sticky top-0 z-10 bg-background-default' : undefined
        }
      >
        <Tab
          value={TAB.personales}
          label={
            <TabLabel label="Personales" error={conError.has(TAB.personales)} />
          }
        />
        <Tab
          value={TAB.votacion}
          label={
            <TabLabel label="Votación" error={conError.has(TAB.votacion)} />
          }
        />
        <Tab
          value={TAB.visita}
          label={<TabLabel label="Visita" error={conError.has(TAB.visita)} />}
        />
      </Tabs>

      <div className="flex flex-col gap-5">
        {tab === TAB.personales && <TabDatosPersonales />}
        {tab === TAB.votacion && <TabVotacion />}
        {tab === TAB.visita && <TabVisita />}
      </div>
    </div>
  )

  return (
    <FormProvider {...form}>
      {esPanel ? (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Degradé al pie: con la barra de scroll oculta es la pista de que hay más abajo. */}
          <div className="relative flex min-h-0 flex-1 flex-col after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-6 after:bg-linear-to-t after:from-background-default">
            <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
              {contenido}
            </div>
          </div>
          <GuardarBarra onGuardar={guardar} onDescartar={() => form.reset()} />
        </div>
      ) : (
        <>
          {/* Aire al pie para que el FAB no tape el último campo. */}
          <div className="pb-24">{contenido}</div>
          <GuardarFab onGuardar={guardar} />
        </>
      )}

      <DescartarCambiosDialog
        open={blocker.state === 'blocked'}
        onDescartar={() => blocker.proceed?.()}
        onSeguir={() => blocker.reset?.()}
      />
    </FormProvider>
  )
}
