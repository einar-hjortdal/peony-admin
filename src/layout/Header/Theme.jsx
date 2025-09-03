import { component } from '@dark-engine/core'

import { useThemeSwitcher } from '../../styles/Theme'

const Theme = component(() => {
  const { selectedThemeName, switchTheme } = useThemeSwitcher()
  return (
    <label>
      {selectedThemeName}
      <button type='button' onClick={switchTheme}>theme toggle</button>
    </label>
  )
})

export default Theme
