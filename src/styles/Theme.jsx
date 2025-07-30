import {
  component,
  useState,
  createContext,
  detectIsEmpty,
  useContext,
  detectIsNull
} from '@dark-engine/core'
import { ThemeProvider } from '@dark-engine/styled'
import { invariant } from '@wareme/utils'

import GlobalStyle from './GlobalStyle'

const breakpoints = {
  sm: '576px', // < 576px = mobile portrait
  md: '768px', // < 768px = mobile landscape
  lg: '992px', // < 992px = tablet
  xl: '1300px', // < 1300px = desktop smaller than 1280
  xxl: '1500px', // < 1500px = desktop smaller than 1536
  xxxl: '2000px' // < 2000px = desktop smaller than 1920
}

const spacing = {
  headerHeightMobile: '3rem',
  headerHeight: '4.5rem',
  footerHeightMobile: '5rem',
  footerHeight: '8rem'
}

const zIndex = {
  zHeader: 1,
  zMobileMenuBackground: 2,
  zMobileMenuForeground: 3
}

const lightColors = {
  asideBg: '#FFFFFF',
  mainBg: '#F7F9FB',
  cardBg: '#FFFFFF',
  dialogHeaderBg: '#2B2D3B',
  dialogHeaderFg: '#FFFFFF',
  primary: '#22C55E',
  secondary: '#96A0B5',
  button: {
    primary: {
      fg: '#FFFFFF',
      bg: '#22C55E',
      hoverBg: '#20BB59'
    },
    secondary: {
      fg: '#FFFFFF',
      bg: '#95a0c5',
      hoverBg: '#8e98bb'
    },
    danger: {
      fg: '#FFFFFF',
      bg: '#EF4D56',
      hoverBg: '#E34952'
    }
  }
}

const darkColors = {

}

const constants = {
  ...breakpoints,
  ...spacing,
  ...zIndex
}

const light = {
  ...lightColors,
  ...constants
}

const dark = {
  ...darkColors,
  ...constants
}

const ThemeSwitcherContext = createContext(null)

export const useThemeSwitcher = () => {
  const context = useContext(ThemeSwitcherContext)
  invariant(!detectIsNull(context), '`useThemeToggle` must be used inside a child of `ThemeSwitcherContext`')
  return context
}

const Theme = component(({ slot }) => {
  const themes = { light, dark }
  const defaultTheme = themes.light
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme)

  const switchTheme = (name) => {
    if (detectIsEmpty(themes[name])) {
      console.error(`Invalid theme name: ${name}, setting default.`)
      return setSelectedTheme(defaultTheme)
    }
    setSelectedTheme(themes[name])
  }

  const value = { switchTheme }

  return (
    <ThemeSwitcherContext value={value}>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyle />
        {slot}
      </ThemeProvider>
    </ThemeSwitcherContext>
  )
})

export default Theme
