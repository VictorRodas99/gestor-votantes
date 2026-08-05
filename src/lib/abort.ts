export const esCancelacion = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError'
