import { useUser } from './data'

export const useUserPreferencesGet = () => {
  const { data } = useUser()
  const userId = data.user.id
  const preferences = localStorage.getItem(userId)
  return JSON.parse(preferences)
}

export const useUserPreferencesSet = (key, value) => {
  const { data } = useUser()
  const userId = data.user.id
  const userPreferences = userPreferencesGet()
}
