import { component, useState, createContext, detectIsEmpty, useContext, detectIsNull } from '@dark-engine/core'
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
  backgroundPrimary: '#E9E1E1',
  backgroundSecondary: '#F8F5F1',
  backgroundTertiary: '#CFBAA0',
  foregroundPrimary: '#202020',
  foregroundSecondary: '#474747',
  foregroundTertiary: '#858585',
  accent: '#7A362A',
  visited: '#827191',
  selection: '#95400E'
}

const constants = {
  ...breakpoints,
  ...spacing,
  ...zIndex
}

const light = {
  ...lightColors,
  borderStyle: `solid 1px ${lightColors.foregroundPrimary}`,
  ...constants
}

const ThemeToggleContext = createContext(null)

export const useThemeToggle = () => {
  const context = useContext(ThemeToggleContext)
  invariant(!detectIsNull(context), '`useThemeToggle` must be used inside a child of `ThemeToggleContext`')
  return { themeToggle: context }
}

const Theme = component(({ slot }) => {
  const themes = { light }
  const defaultTheme = themes.light
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
  const toggleTheme = (name) => {
    if (detectIsEmpty(themes[name])) {
      return setSelectedTheme(defaultTheme)
    }
    setSelectedTheme(themes[name])
  }

  return (
    <ThemeToggleContext value={toggleTheme}>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyle />
        {slot}
      </ThemeProvider>
    </ThemeToggleContext>
  )
})

export default Theme
