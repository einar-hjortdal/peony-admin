import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useThemeSwitcher } from '../styles/Theme'
import { nisha } from '@wareme/utils'

const StyledDiv = styled.div`
  display: inline-block;
  padding-top: .4rem;
  padding-right: .4rem;
  padding-bottom: .4rem;
  padding-left: .4rem;
  border-radius: 20rem;
  border: 1px solid ${p => p.theme.neutral30};
`

const StyledButton = styled.button`
  color: ${p => nisha(p.$isActive, p.theme.neutral00, p.theme.fg)};
  background-color: ${p => nisha(p.$isActive, p.theme.warning, p.theme.bg)};
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
`

const ThemeSwitch = component(() => {
  const { t } = useTranslation('layout.themeSwitch')
  const { selectedThemeName, switchTheme, themeNameLight, themeNameDark } = useThemeSwitcher()

  return (
    <StyledDiv>
      <StyledButton
        type='button'
        aria-label={t('light')}
        onClick={switchTheme}
        $isActive={selectedThemeName === themeNameLight}
        disabled={selectedThemeName === themeNameLight}
      >
        sun
      </StyledButton>
      <StyledButton
        type='button'
        aria-label={t('dark')}
        onClick={switchTheme}
        $isActive={selectedThemeName === themeNameDark}
        disabled={selectedThemeName === themeNameDark}
      >
        moon
      </StyledButton>
    </StyledDiv>
  )
})

export default ThemeSwitch
