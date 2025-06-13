import { config } from './config'

class PeonyError extends Error {
  constructor (data) {
    super(data.message)
    this.details = data.details
  }
}

const checkResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new PeonyError(data)
  }
  return data
}

export const keys = {
  getUser: 'getUser',
  postAuth: 'postAuth'
}

const getRequestUrl = (path) => {
  return `${config.peonyUrl}${path}`
}

export const api = {
  getUserData: async () => {
    const response = await fetch(getRequestUrl('/admin/auth'), { credentials: 'include' })
    return checkResponse(response)
  },

  loginUser: async (email, password) => {
    const response = await fetch(getRequestUrl('/admin/auth'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    return checkResponse(response)
  }
}
