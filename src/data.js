import { useApi, useQuery, useMutation } from '@dark-engine/data'

import { keys } from './api'

export const useUser = () => {
  const api = useApi()
  return useQuery(keys.getUser, () => api.getUserData())
}

export const useUserLoginMutation = (email, password) => {
  const api = useApi()
  return useMutation(keys.postAuth, () => api.loginUser(email, password), {
    onSuccess: ({ cache, data }) => {
      cache.write(keys.getUser, data, { id: data.id })
    }
  })
}

export const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(response.status)
  }
}
