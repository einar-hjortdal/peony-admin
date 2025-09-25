import { styled } from '@dark-engine/styled'

import { component, detectIsArray, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import If from '../If'

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

const Wrapper = styled.div`
  position: relative;
  display: inline-block;

  & ul {
    position: absolute;
    top: 1.5rem;
    right: 0;
    white-space: nowrap;
  }
`

const ButtonMore = component(({ slot }) => {
  const { t } = useTranslation('buttons.more')
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <StyledButton aria-label={t('label')} type='button' onClick={toggleMenu}>
        <svg viewBox='0 0 24 8' aria-hidden='true'>
          <circle cx='4' cy='4' r='3' />
          <circle cx='12' cy='4' r='3' />
          <circle cx='20' cy='4' r='3' />
        </svg>
      </StyledButton>
      <Wrapper>
        <If condition={isOpen}>
          {slot}
        </If>
      </Wrapper>
    </>
  )
})

export default ButtonMore
