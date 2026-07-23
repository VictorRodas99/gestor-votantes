export function appendCampo(
  form: FormData,
  clave: string,
  valor: unknown
): void {
  if (valor === null || valor === undefined) return

  if (typeof valor === 'boolean') {
    form.append(clave, valor ? '1' : '0')
    return
  }

  if (typeof valor === 'object') {
    for (const [subclave, subvalor] of Object.entries(valor)) {
      appendCampo(form, `${clave}[${subclave}]`, subvalor)
    }
    return
  }

  form.append(clave, String(valor))
}

export function toFormData(payload: Record<string, unknown>): FormData {
  const form = new FormData()
  for (const [clave, valor] of Object.entries(payload)) {
    appendCampo(form, clave, valor)
  }
  return form
}
