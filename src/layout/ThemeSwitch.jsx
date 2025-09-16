import { component } from '@dark-engine/core'

import { useThemeSwitcher } from '../styles/Theme'

const ThemeSwitch = component(() => {
  const { selectedThemeName, switchTheme } = useThemeSwitcher()

  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  return (
    <label onclick={handleLabelClick}>
      {selectedThemeName}
      <button type='button' onClick={switchTheme}>theme toggle</button>
    </label>
  )
})

export default ThemeSwitch
