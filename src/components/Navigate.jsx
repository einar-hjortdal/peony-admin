import { component } from '@dark-engine/core'
import { useHistory } from '@dark-engine/web-router'

const Navigate = component(({ to }) => {
  const history = useHistory()
  history.push(to)
})

export default Navigate
