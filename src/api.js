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

const adminPrefix = '/admin/'

// params must be a string that will be concatenated to path using the `?` separator
const getRequestUrl = (path, params) => {
  if (detectIsEmpty(params) || (detectIsString(params) && params === '')) {
    return `${config.peonyUrl}${adminPrefix}${path}`
  }
  return `${config.peonyUrl}${adminPrefix}${path}?${params}`
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
  categoryCreate: 'categoryCreate',
  categoryGet: 'categoryGet',
  categoryGetById: 'categoryGetById',
  categoryUpdate: 'categoryUpdate',
  categoryDelete: 'categoryDelete',
  productOptionGet: 'productOptionGet',
  productOptionCreate: 'productOptionCreate',
  productOptionUpdate: 'productOptionUpdate',
  productOptionDelete: 'productOptionDelete',
  productOptionValueCreate: 'productOptionValueCreate',
  productOptionValueUpdate: 'productOptionValueUpdate',
  productOptionValueDelete: 'productOptionValueDelete',
  productVariantGetById: 'productVariantGetById',
  productVariantCreate: 'productVariantCreate',
  productVariantUpdate: 'productVariantUpdate',
  productVariantDelete: 'productVariantDelete',
  productSEOUpdate: 'productSEOUpdate',
  inventoryLevelUpdate: 'inventoryLevelUpdate',
  countriesGet: 'countriesGet',
  currencyGet: 'currencyGet',
  regionsGet: 'regionsGet',
  regionsGetById: 'regionsGetById',
  regionsCreate: 'regionsCreate',
  regionGetById: 'regionGetById',
  regionUpdate: 'regionUpdate',
  salesChannelsGet: 'salesChannelsGet',
  stockLocationsGet: 'stockLocationsGet',
  stockLocationsGetById: 'stockLocationsGetById',
  localesGet: 'localesGet',
  localeGetById: 'localeGetById',
  uploadsUploadOne: 'uploadsUploadOne',
  uploadsUploadMany: 'uploadsUploadMany',
  uploadsDelete: 'uploadsDelete'
}

export const api = {
  getUserData: async () => {
    const response = await fetch(getRequestUrl('auth'), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  loginUser: async (email, password) => {
    const response = await fetch(getRequestUrl('auth'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  logoutUser: async () => {
    const response = await fetch(getRequestUrl('auth'), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  storeGet: async () => {
    const response = await fetch(getRequestUrl('store'), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  storeUpdate: async (id, data) => {
    const response = await fetch(getRequestUrl(`store/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productsGet: async (params) => {
    const response = await fetch(getRequestUrl('products', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productGetById: async (id) => {
    const response = await fetch(getRequestUrl(`products/${id}`), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productCreate: async (data) => {
    const response = await fetch(getRequestUrl('products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productUpdate: async (id, data) => {
    const response = await fetch(getRequestUrl(`products/${id}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  productDelete: async (id) => {
    const response = await fetch(getRequestUrl(`products/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  },

  categoryCreate: async (data) => {
    const response = await fetch(getRequestUrl('categories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  categoryGetById: async (categoryId) => {
    const response = await fetch(
      getRequestUrl(`categories/${categoryId}`),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  categoryGet: async (params) => {
    const response = await fetch(
      getRequestUrl('categories', params),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  categoryUpdate: async (categoryId, data) => {
    const response = await fetch(
      getRequestUrl(`categories/${categoryId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })
    return checkResponse(response)
  },

  categoryDelete: async (categoryId) => {
    const response = await fetch(
      getRequestUrl(`categories/${categoryId}`),
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productOptionGet: async (productId) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options`),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productOptionCreate: async (productId, data) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionUpdate: async (productId, optionId, data) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options/${optionId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionDelete: async (productId, optionId) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options/${optionId}`),
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productOptionValueCreate: async (productId, optionId, data) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options/${optionId}/values`),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionValueUpdate: async (productId, optionId, valueId, data) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options/${optionId}/values/${valueId}`),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      }
    )
    return checkResponse(response)
  },

  productOptionValueDelete: async (productId, optionId, valueId) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/options/${optionId}/values/${valueId}`),
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantGetById: async (productId, variantId) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/variants/${variantId}`),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantCreate: async (id, data) => {
    const response = await fetch(
      getRequestUrl(`products/${id}/variants`),
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
      getRequestUrl(`products/${productId}/variants/${variantId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productVariantDelete: async (productId, variantId) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/variants/${variantId}`),
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  productSEOUpdate: async (productId, seoId, data) => {
    const response = await fetch(
      getRequestUrl(`products/${productId}/seo/${seoId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  inventoryLevelUpdate: async (inventoryItemId, stockLocationId, data) => {
    const response = await fetch(
      getRequestUrl(`inventory-items/${inventoryItemId}/stock-locations/${stockLocationId}`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  countriesGet: async (params) => {
    const response = await fetch(getRequestUrl('countries', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  currencyGet: async (params) => {
    const response = await fetch(getRequestUrl('currencies', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  currencyUpdate: async (code, data) => {
    const response = await fetch(getRequestUrl(`currencies/${code}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return checkResponse(response)
  },

  regionsGet: async (params) => {
    const response = await fetch(getRequestUrl('regions', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  regionsGetById: async (regionId) => {
    const response = await fetch(getRequestUrl(`regions/${regionId}`), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  salesChannelsGet: async (params) => {
    const response = await fetch(
      getRequestUrl('sales-channels', params),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  stockLocationsGet: async (params) => {
    const response = await fetch(
      getRequestUrl('stock-locations', params),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  stockLocationsGetById: async (stockLocationId) => {
    const response = await fetch(
      getRequestUrl(`stock-locations/${stockLocationId}`),
      {
        credentials: 'include'
      }
    )
    return checkResponse(response)
  },

  localesGet: async (params) => {
    const response = await fetch(getRequestUrl('locales', params), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  localeGetById: async (localeId) => {
    const response = await fetch(getRequestUrl(`locales/${localeId}`), {
      credentials: 'include'
    })
    return checkResponse(response)
  },

  uploadsUploadOne: async (file) => {
    const response = await fetch(getRequestUrl(`uploads/${file.name}`), {
      method: 'POST',
      credentials: 'include',
      body: file
    })
    return checkResponse(response)
  },

  uploadsUploadMany: async (formData, params) => {
    const response = await fetch(getRequestUrl('uploads', params), {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    return checkResponse(response)
  },

  uploadsDelete: async (id) => {
    const response = await fetch(getRequestUrl(`uploads/${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })
    return checkResponse(response)
  }
}
