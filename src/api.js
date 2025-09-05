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
  productsGet: 'productsGet',
  productGetById: 'productGetById',
  productCreate: 'productCreate',
  productUpdate: 'productUpdate',
  productDelete: 'productDelete',
  productCategoryCreate: 'productCategoryCreate',
  productCategoryGet: 'productCategoryGet',
  productCategoryGetById: 'productCategoryGetById',
  productCategoryUpdate: 'productCategoryUpdate',
  productCategoryDelete: 'productCategoryDelete',
  productOptionCreate: 'productOptionCreate',
  productOptionUpdate: 'productOptionUpdate',
  productOptionDelete: 'productOptionDelete',
  productVariantCreate: 'productVariantCreate',
  productVariantUpdate: 'productVariantUpdate',
  productVariantDelete: 'productVariantDelete',
  countriesGet: 'countriesGet',
  currencyGet: 'currencyGet',
  currencyUpdate: 'currencyUpdate',
  regionsGet: 'regionsGet',
  regionsCreate: 'regionsCreate',
  regionGetById: 'regionGetById',
  regionUpdate: 'regionUpdate',
  salesChannelsGet: 'salesChannelsGet',
  localesGet: 'localesGet',
  uploadsUploadOne: 'uploadsUploadOne',
  uploadsUploadMany: 'uploadsUploadMany',
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
    const response = await fetch(getRequestUrl('/admin/auth'), {
      credentials: 'include'
    })
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

  productsGet: async (params) => {
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

  productCategoryGetById: async (productCategoryId) => {
    const response = await fetch(
      getRequestUrl(`/admin/product-categories/${productCategoryId}`),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productOptionCreate: async (productId, data) => {
    const response = await fetch(
      getRequestUrl(`/admin/products/${productId}/options`),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionUpdate: async (productId, optionId, data) => {
    const response = await fetch(
      getRequestUrl(`/admin/products/${productId}/options/${optionId}`),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionDelete: async (productId, optionId) => {
    const response = await fetch(
      getRequestUrl(`/admin/products/${productId}/options/${optionId}`),
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantCreate: async (id, data) => {
    const response = await fetch(
      getRequestUrl(`/admin/products/${id}/variants`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantUpdate: async (productId, variantId, data) => {
    const response = await fetch(
      getRequestUrl(`/admin/products/${productId}/variants/${variantId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantDelete: async (id) => {
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
    const response = await fetch(
      getRequestUrl('/admin/sales-channels', params),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  localesGet: async (params) => {
    const response = await fetch(getRequestUrl('/admin/locales', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  uploadsUploadOne: async (file) => {
    const response = await fetch(getRequestUrl(`/admin/uploads/${file.name}`), {
      method: 'POST',
      credentials: 'include',
      body: file
    })
    return checkResponse(response)
  },

  uploadsUploadMany: async (formData, params) => {
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
