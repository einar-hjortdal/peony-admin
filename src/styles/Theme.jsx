import {
  component,
  useState,
  createContext,
  useContext,
  detectIsNull,
  detectIsString
} from '@dark-engine/core'
import { ThemeProvider } from '@dark-engine/styled'
import { invariant } from '@wareme/utils'

import GlobalStyle from './GlobalStyle'
import { detectIsBrowser } from '@dark-engine/platform-browser'

const breakpoints = {
  sm: '576px', // < 576px = mobile portrait
  md: '768px', // < 768px = mobile landscape
  lg: '992px', // < 992px = tablet
  xl: '1300px', // < 1300px = desktop smaller than 1280
  xxl: '1500px', // < 1500px = desktop smaller than 1536
  xxxl: '2000px' // < 2000px = desktop smaller than 1920
}

const spacing = {
  asideWidth: '16rem',
  headerHeight: '4rem'
}

const zIndex = {
  zHeader: 1,
  zMobileMenuBackground: 2,
  zMobileMenuForeground: 3
}

const lightColors = {
  bg: '#FAFAFA',
  fg: '#201A23',
  borderColor: '#CCCCCC',
  cardBg: '#E6E6E6',
  active: '#366396',
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

const themeNameLight = 'light'
const themeNameDark = 'dark'
const defaultTheme = themeNameLight

const themeLight = {
  ...lightColors,
  ...constants
}

const themeDark = {
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
  const themesAvailable = {
    [themeNameLight]: themeLight,
    [themeNameDark]: themeDark
  }

  const getActiveTheme = () => {
    if (!detectIsBrowser()) {
      return defaultTheme
    }

    const setTheme = localStorage.getItem('theme')
    if (detectIsString(setTheme)) {
      return setTheme
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)')

    if (darkQuery.media === 'not all') {
      return defaultTheme
    }

    if (darkQuery.matches) {
      return themeNameDark
    }

    if (lightQuery.matches) {
      return themeNameLight
    }

    return defaultTheme
  }

  const [selectedThemeName, setSelectedThemeName] = useState(getActiveTheme())

  const setActiveTheme = (themeName) => {
    if (!detectIsBrowser()) {
      return
    }

    localStorage.setItem('theme', themeName)
  }

  const switchTheme = () => {
    if (selectedThemeName === themeNameLight) {
      setActiveTheme(themeNameDark)
      setSelectedThemeName(themeNameDark)
    } else {
      setActiveTheme(themeNameLight)
      setSelectedThemeName(themeNameLight)
    }
  }

  const value = { selectedThemeName, switchTheme }

  return (
    <ThemeSwitcherContext value={value}>
      <ThemeProvider theme={themesAvailable[selectedThemeName]}>
        <GlobalStyle />
        {slot}
      </ThemeProvider>
    </ThemeSwitcherContext>
  )
})

export default Theme
