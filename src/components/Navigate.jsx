import { component, useEffect } from '@dark-engine/core'
import { useHistory } from '@dark-engine/web-router'

const Navigate = component(({ to }) => {
  const history = useHistory()
  useEffect(() => {
    history.push(to)
  }, [])

  return null
})

export default Navigate
