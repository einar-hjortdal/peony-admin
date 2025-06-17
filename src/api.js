import { detectIsEmpty, detectIsString } from '@dark-engine/core'
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

export const dataKeys = {
  getUser: 'getUser',
  postAuth: 'postAuth',
  getStore: 'getStore',
  getProducts: 'getProducts',
  createProduct: 'createProduct'
}

// params must be a string that will be concatenated to path using the `?` separator
const getRequestUrl = (path, params) => {
  if (detectIsEmpty(params) || (detectIsString(params) && params === '')) {
    return `${config.peonyUrl}${path}`
  }
  return `${config.peonyUrl}${path}?${params}`
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
  },

  getStore: async () => {
    const response = await fetch(getRequestUrl('/admin/store'), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  getProducts: async (params) => {
    const response = await fetch(getRequestUrl('/admin/products', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  createProduct: async (data) => {
    const response = await fetch(getRequestUrl('/admin/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  }
}
