import { component } from '@dark-engine/core'
import { useThemeSwitcher } from '../styles/Theme'
import { useTranslation } from '@wareme/translations'

const Header = component(() => {
  const { t } = useTranslation('header')
  const { selectedThemeName, switchTheme } = useThemeSwitcher()

  return (
    <div>
      header
      <button type='button' onClick={switchTheme}>theme toggle</button>
      <button type='button'>language selection</button>
    </div>
  )
})

export default Header
