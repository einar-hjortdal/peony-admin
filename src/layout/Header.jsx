import { component } from '@dark-engine/core'

const Header = component(() => {
  return (
    <div>
      header
      <button type='button'>theme toggle</button>
      <button type='button'>language selection</button>
    </div>
  )
})

export default Header
