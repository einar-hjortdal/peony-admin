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

const lightColors = {
  bg: '#F5F5F5',
  fg: '#0A0A0A',
  neutral00: '#FAFAFA',
  neutral10: '#F5F5F5',
  neutral20: '#D6D6D6',
  neutral30: '#C2C2C2',
  neutral40: '#ADADAD',
  neutral50: '#999999',
  neutral60: '#858585',
  neutral70: '#707070',
  neutral80: '#5C5C5C',
  neutral90: '#474747',
  neutral93: '#333333',
  neutral96: '#1F1F1F',
  neutral99: '#0A0A0A',
  active: '#366396',
  secondary: '#96A0B5',
  safe: '#4C6B56',
  danger: '#AE2C1E',
  button: {
    primary: {
      bg: '#366396',
      fg: '#F5F5F5',
      hoverBg: '#2B4F78'
    },
    secondary: {
      bg: '#95a0c5',
      fg: '#FFFFFF',
      hoverBg: '#8e98bb'
    },
    danger: {
      bg: '#EF4D56',
      fg: '#FFFFFF',
      hoverBg: '#E34952'
    }
  }
}

const darkColors = {
  ...lightColors
}

const constants = {
  // breakpoints
  sm: '576px', // < 576px = mobile portrait
  md: '768px', // < 768px = mobile landscape
  lg: '992px', // < 992px = tablet
  xl: '1300px', // < 1300px = desktop smaller than 1280
  xxl: '1500px', // < 1500px = desktop smaller than 1536
  xxxl: '2000px', // < 2000px = desktop smaller than 1920

  // z-index
  zHeader: 1,
  zMobileMenuBackground: 2,
  zMobileMenuForeground: 3,

  borderRadius: '0.75rem',
  asideWidth: '16rem',
  headerHeight: '4rem'
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
