import { component, useEffect } from '@dark-engine/core'

import { config } from '../config'

const addTitlePostfix = (title) => {
  return `${title} | ${config.name}`
}

const SetTitle = component(({ title }) => {
  useEffect(() => {
    document.title = addTitlePostfix(title)
  }, [title])
  return null
})

export default SetTitle
