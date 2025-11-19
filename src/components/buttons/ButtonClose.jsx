import { component } from '@dark-engine/core'

// TODO
const ButtonClose = component(({ slot, ...props }) => {
  return <button {...props}>{slot}</button>
})

export default ButtonClose
