// Paleta determinista para avatares de iniciales: cada persona cae siempre en el
// mismo color (por una semilla estable, normalmente su cédula), dando variedad
// visual sin ser aleatorio entre renders. Compartido por el listado de votantes
// y las listas de asignación de punteros para un mismo principio de color.

const AVATAR_COLORS = [
  'var(--mui-palette-primary-main)',
  'var(--mui-palette-primary-light)',
  'var(--mui-palette-success-main)',
  'var(--mui-palette-secondary-dark)',
  '#5b3d8a'
]

export function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash]
}
