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
  authPost: 'authPost',
  authDelete: 'authDelete',
  storeGet: 'storeGet',
  storeUpdate: 'storeUpdate',
  getProducts: 'getProducts',
  getProductById: 'getProductById',
  createProduct: 'createProduct',
  updateProduct: 'updateProduct',
  deleteProduct: 'deleteProduct',
  currencyGet: 'currencyGet',
  currencyUpdate: 'currencyUpdate',
  localesGet: 'localesGet'
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

  logoutUser: async () => {
    const response = await fetch(getRequestUrl('/admin/auth'), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  storeGet: async () => {
    const response = await fetch(getRequestUrl('/admin/store'), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  storeUpdate: async (id, data) => {
    const response = await fetch(getRequestUrl(`/admin/store/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

  getProductById: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
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
  },

  updateProduct: async (id, data) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  deleteProduct: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  currencyGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/currencies', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  currencyUpdate: async (code, data) => {
    const response = await fetch(getRequestUrl(`/admin/currencies/${code}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  localesGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/locales', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  }
}
