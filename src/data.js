import { keys, detectIsEmpty, useMemo, detectIsUndefined } from '@dark-engine/core'
import { useApi, useQuery, useMutation } from '@dark-engine/data'

import { dataKeys } from './api'

export const constants = {
  orderAsc: 'ASC',
  orderDesc: 'DESC',
  statusDraft: 'draft',
  statusProposed: 'proposed',
  statusPublished: 'published',
  statusRejected: 'rejected'
}

// return a new object from the object p without any null/undefined values
const cleanParams = (p) => {
  const res = {}
  const k = keys(p)
  for (let i = 0, len = k.length; i < len; i++) {
    const key = k[i]
    if (detectIsEmpty(p[key])) {
      continue
    }
    res[key] = p[key]
  }
  return res
}

const getParams = (params) => {
  const p = new URLSearchParams(cleanParams(params))
  p.sort()
  return p.toString()
}

export const useUser = () => {
  const api = useApi()
  return useQuery(dataKeys.getUser, () => api.getUserData())
}

export const useUserLoginMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.authPost, (email, password) => api.loginUser(email, password), {
    onSuccess: ({ cache, data }) => {
      cache.write(dataKeys.getUser, data, { id: data.id })
    }
  })
}

export const useUserLogoutMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.authDelete, () => api.logoutUser(), {
    onSuccess: ({ cache }) => {
      cache.invalidate(dataKeys.authPost)
      cache.delete(dataKeys.authPost)
      cache.invalidate(dataKeys.getUser)
      cache.delete(dataKeys.getUser)
    }
  })
}

export const useStore = () => {
  const api = useApi()
  const { refetch, data, isFetching, error } = useQuery(dataKeys.storeGet, () => api.storeGet())

  const localesObject = useMemo(() => {
    const res = []
    if (detectIsEmpty(data)) {
      return res
    }

    const { locales } = data
    for (let i = 0, len = locales.length; i < len; i++) {
      const { id, code } = locales[i]
      res[id] = code
    }
    return res
  }, data)

  return { refetch, data, isFetching, error, localesObject }
}

export const useStoreUpdateMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.storeUpdate, (id, data) => api.storeUpdate(id, data), {
    onSuccess: ({ cache }) => {
      cache.invalidate(dataKeys.storeGet)
    }
  })
}

export const useProducts = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.getProducts, () => api.getProducts(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useProductById = (id) => {
  const api = useApi()
  const { refetch, data, isFetching, error } = useQuery(dataKeys.getProductById, () => api.getProductById(id), {
    variables: { id },
    extractId: (x) => x.id
  })

  const translationsObject = useMemo(() => {
    const res = {}
    if (detectIsEmpty(data)) {
      return res
    }

    const { translations } = data
    if (detectIsUndefined(translations)) {
      return res
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const { localeId } = translations[i]
      res[localeId] = translations[i]
    }
    return res
  }, data)

  return { refetch, data, isFetching, error, translationsObject }
}

export const useCreateProductMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.createProduct, (data) => api.createProduct(data))
  // TODO onSuccess invalidate all dataKeys.getProducts from cache https://github.com/atellmer/dark/issues/107
}

export const useUpdateProductMutation = (id) => {
  const api = useApi()
  return useMutation(dataKeys.updateProduct, (data) => api.updateProduct(id, data), {
    variables: { id },
    extractId: (x) => x.id
  })
}

export const useDeleteProductMutation = (id) => {
  const api = useApi()
  return useMutation(dataKeys.deleteProduct, () => api.deleteProduct(id), {
    variables: { id },
    extractId: (x) => x.id
  })
}

export const useCreateVariantMutation = (id) => {
  const api = useApi()
  return useMutation(dataKeys.variantCreate, (data) => api.variantCreate(id, data), {
    variables: { id },
    extractId: (x) => x.id
  })
}

export const useUpdateVariantMutation = (id) => {
  const api = useApi()
  return useMutation(dataKeys.variantUpdate, (data) => api.variantUpdate(id, data), {
    variables: { id },
    extractId: (x) => x.id
  })
}

export const useCurrencies = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.currencyGet, () => api.currencyGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useLocales = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.localesGet, () => api.localesGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useUpdateCurrencyMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.currencyUpdate, (code, data) => api.currencyUpdate(code, data), {
    onSuccess: ({ cache }) => {
      cache.invalidate(dataKeys.storeGet)
    }
  })
}
