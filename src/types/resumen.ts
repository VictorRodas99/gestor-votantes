// respuesta de endpoint de api `/info`
// A diferencia del resto de la API, acá los valores vuelven como números reales;
// se castea igual por si el proveedor los pasa a string.
export type ResumenCampanaRaw = {
  cargados?: number | string
  visitados?: number | string
  voto_seguro?: number | string
  afiliados?: number | string
}

export type ResumenCampana = {
  cargados: number
  visitados: number
  votoSeguro: number
  afiliados: number
}
