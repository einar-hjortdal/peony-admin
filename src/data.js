import { keys, detectIsEmpty } from '@dark-engine/core'
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
  return useMutation(dataKeys.postAuth, (email, password) => api.loginUser(email, password), {
    onSuccess: ({ cache, data }) => {
      cache.write(dataKeys.getUser, data, { id: data.id })
    }
  })
}

export const useStore = () => {
  const api = useApi()
  return useQuery(dataKeys.getStore, () => api.getStore())
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
  return useQuery(dataKeys.getProductById, () => api.getProductById(id), {
    variables: { id },
    extractId: (x) => x.id
  })
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
