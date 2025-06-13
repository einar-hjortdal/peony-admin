import { useApi, useQuery, useMutation } from '@dark-engine/data'

import { keys } from './api'

export const useUser = () => {
  const api = useApi()
  return useQuery(keys.getUser, () => api.getUserData())
}

export const useUserLoginMutation = () => {
  const api = useApi()
  return useMutation(keys.postAuth, (email, password) => api.loginUser(email, password), {
    onSuccess: ({ cache, data }) => {
      cache.write(keys.getUser, data, { id: data.id })
    }
  })
}
