// todos los valores de response devuelven string o null, castear en el servicio

export type PaginatedResponse<T> = {
  data: T[]
  total_items: number

  // a veces string, a veces number
  page: number | string
  per_page: number | string
}
