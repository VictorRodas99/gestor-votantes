// Writer genérico de `.xlsx`

export type ColumnaExcel<Fila, Ctx> = {
  header: string
  width?: number
  format?: string
  /** `null` deja la celda vacía. */
  valor: (fila: Fila, ctx: Ctx) => string | number | null
}

type OpcionesExcel = {
  nombreArchivo: string
  hoja?: string
  signal?: AbortSignal
}

export async function descargarExcel<Fila, Ctx>(
  filas: Fila[],
  columnas: ColumnaExcel<Fila, Ctx>[],
  ctx: Ctx,
  { nombreArchivo, hoja, signal }: OpcionesExcel
): Promise<void> {
  // no entra al chunk de la página.
  const { default: writeExcelFile } = await import('write-excel-file/browser')

  // Última chance de cortar
  signal?.throwIfAborted()

  const columns = columnas.map((columna) => ({
    header: { value: columna.header, fontWeight: 'bold' as const },
    width: columna.width,
    cell: (fila: Fila) => ({
      // `null` no es un valor de celda válido para la librería; `undefined` sí.
      value: columna.valor(fila, ctx) ?? undefined,
      format: columna.format
    })
  }))

  await writeExcelFile(filas, { columns, sheet: hoja }).toFile(nombreArchivo)
}
