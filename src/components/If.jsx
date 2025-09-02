import { component } from '@dark-engine/core'

const If = component(({ condition, slot }) => {
  if (condition) {
    return slot
  }
  return false
})

export default If
