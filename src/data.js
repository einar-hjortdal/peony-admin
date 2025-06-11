import { useApi, useQuery } from '@dark-engine/data'

import { keys } from './api'

export const useUser = () => {
  const api = useApi()
  return useQuery(keys.userGet, () => api.getUserData())
}

export const useLoginAdmin = (email, password) => {
  const api = useApi()
  return useQuery(keys.adminAuth, () => api.loginAdmin(email, password))
}

export const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(response.status)
  }
}
