import { component } from '@dark-engine/core'
import { useThemeSwitcher } from '../styles/Theme'

const Header = component(() => {
  const { switchTheme } = useThemeSwitcher()
  return (
    <div>
      header
      <button type='button' onClick={() => switchTheme('dark')}>theme toggle</button>
      <button type='button'>language selection</button>
    </div>
  )
})

export default Header
