// todos los valores de response devuelven string o null, castear en el servicio

export type PaginatedResponse<T> = {
  data: T[]

  // a veces string, a veces number (igual que page/per_page)
  total_items: number | string
  page: number | string
  per_page: number | string
}
