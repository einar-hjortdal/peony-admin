import { styled } from '@dark-engine/styled'

import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

const StyledButton = styled.button`
  border-radius: 0.3125rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: unset;
  & svg {
    width: 1.5rem;
    height: .5rem;
    color: ${p => p.theme.fg};
    fill: ${p => p.theme.fg};
  }
`

const ButtonMore = component(({ slot, ...props }) => {
  const { t } = useTranslation('buttons.more')
  return (
    <StyledButton aria-label={t('label')} {...props}>
      <svg viewBox='0 0 24 8' aria-hidden='true'>
        <circle cx='4' cy='4' r='3' />
        <circle cx='12' cy='4' r='3' />
        <circle cx='20' cy='4' r='3' />
      </svg>
      {slot}
    </StyledButton>
  )
})

ButtonMore.Container = styled.div`
  position: absolute;
`

export default ButtonMore
