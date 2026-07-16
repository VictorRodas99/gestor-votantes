import ky, { HTTPError } from 'ky'
import { API_URL } from '../constants/config'

const api = ky.create({
  prefix: API_URL,
  headers: {
    Accept: 'application/json'
  },
  retry: {
    limit: 2,
    jitter: true
  },
  hooks: {
    beforeError: [
      async (state) => {
        const { error } = state
        const response = error instanceof HTTPError ? error.response : undefined

        // El body puede no ser JSON
        try {
          const body = await response?.clone().json()

          if (
            typeof body === 'object' &&
            body !== null &&
            'message' in body &&
            typeof body.message === 'string'
          ) {
            error.message = body.message
          }
        } catch {
          // Body no-JSON: dejamos el mensaje por defecto de ky.
        }

        return error
      }
    ]
  }
})

export default api
