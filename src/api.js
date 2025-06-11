import { config } from './config'
import { checkResponse } from './data'

export const keys = {
  userGet: 'userGet',
  adminLogin: 'adminAuth'
}

const getRequestUrl = (path) => {
  return `${config.peonyUrl}${path}`
}

export const api = {
  getUserData: async () => {
    const response = await fetch(getRequestUrl('/admin/auth'), { credentials: 'include' })
    checkResponse(response)
    const data = await response.json()
    return data
  },

  loginUser: async (email, password) => {
    const response = await fetch(getRequestUrl('/admin/auth'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    checkResponse(response)
    return response.json()
  }
}
