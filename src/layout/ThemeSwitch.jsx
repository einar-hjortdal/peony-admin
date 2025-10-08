import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useThemeSwitcher } from '../styles/Theme'

const StyledDiv = styled.div`
  display: inline-block;
  padding-top: .375rem;
  padding-right: .375rem;
  padding-bottom: .375rem;
  padding-left: .375rem;
  border-radius: 20rem;
  border: 1px solid ${p => p.theme.neutral30};
  vertical-align: middle;
`

const StyledButton = styled.button`
  background-color: ${p => p.theme.bg};
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 50%;
  cursor: pointer;

  &:disabled{
    color: ${p => p.theme.neutral00};
    background-color: ${p => p.theme.warning};
    cursor: auto;
  }
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
        disabled={selectedThemeName === themeNameLight}
      >
        sun
      </StyledButton>
      <StyledButton
        type='button'
        aria-label={t('dark')}
        onClick={switchTheme}
        disabled={selectedThemeName === themeNameDark}
      >
        moon
      </StyledButton>
    </StyledDiv>
  )
})

export default ThemeSwitch
