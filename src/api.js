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
  productGetById: 'productGetById',
  productCreate: 'productCreate',
  productUpdate: 'productUpdate',
  productDelete: 'productDelete',
  productOptionCreate: 'productOptionCreate',
  productOptionUpdate: 'productOptionUpdate',
  productOptionDelete: 'productOptionDelete',
  variantCreate: 'productVariantCreate',
  variantUpdate: 'productVariantUpdate',
  variantDelete: 'productVariantDelete',
  countriesGet: 'countriesGet',
  currencyGet: 'currencyGet',
  currencyUpdate: 'currencyUpdate',
  regionsGet: 'regionsGet',
  regionsCreate: 'regionsCreate',
  regionGetById: 'regionGetById',
  regionUpdate: 'regionUpdate',
  salesChannelsGet: 'salesChannelsGet',
  localesGet: 'localesGet',
  uploadsUpload: 'uploadsUpload',
  uploadsDelete: 'uploadsDelete'
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

  productGetById: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productCreate: async (data) => {
    const response = await fetch(getRequestUrl('/admin/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productUpdate: async (id, data) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productDelete: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productOptionCreate: async (productId, data) => {
    const response = await fetch(getRequestUrl(`/admin/products/${productId}/options}`), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return checkResponse(response)
  },

  productOptionUpdate: async (productId, optionId, data) => {
    const response = await fetch(getRequestUrl(`/admin/products/${productId}/options/${optionId}`), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return checkResponse(response)
  },

  productOptionDelete: async (productId, optionId) => {
    const response = await fetch(getRequestUrl(`/admin/products/${productId}/options/${optionId}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  variantCreate: async (id, data) => {
    const response = await fetch(getRequestUrl(`/admin/products/${id}/variants`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  variantUpdate: async (id, data) => {
    const response = await fetch(getRequestUrl(`/admin/variants/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  variantDelete: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/variants/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  countriesGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/countries', params), {
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

  regionsGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/regions', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  salesChannelsGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/sales-channels', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  localesGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/locales', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  uploadsUpload: async (formData, params) => {
    const response = await fetch(getRequestUrl('/admin/uploads', params), {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    return checkResponse(response)
  },

  uploadsDelete: async (id) => {
    const response = await fetch(getRequestUrl(`/admin/uploads/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  }
}
