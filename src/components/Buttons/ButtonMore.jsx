import { component, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
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

const StyledDiv = styled.div`
  position: relative;
  display: inline-block;
`

const StyledUl = styled.ul`
  position: absolute;
  border-radius: .3rem;
  top: 1.5rem;
  right: 0;
  white-space: nowrap;
  background-color: ${p => p.theme.bg};
  box-shadow: 0 .2rem 1.5rem 0 rgba(0, 0, 0, 0.25);
  padding-top: .3rem;
  padding-right: .3rem;
  padding-bottom: .3rem;
  padding-left: .3rem;
  min-width: 8rem;

  & li button {
    width: 100%;
    border-radius: .3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    text-align: left;
    cursor: pointer;
    color: inherit;
    background-color: inherit;
  }

  & li button:hover {
    color: ${p => p.theme.bg};
    background-color: ${p => p.theme.active};
  }
`

const ButtonMore = component(({ slot }) => {
  const { t } = useTranslation('buttons.more')
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <StyledDiv>
      <StyledButton aria-label={t('label')} type='button' onClick={toggleMenu}>
        <svg viewBox='0 0 24 8' aria-hidden='true'>
          <circle cx='4' cy='4' r='3' />
          <circle cx='12' cy='4' r='3' />
          <circle cx='20' cy='4' r='3' />
        </svg>
      </StyledButton>
      <If condition={isOpen}>
        <StyledUl>
          {slot}
        </StyledUl>
      </If>
    </StyledDiv>
  )
})

export default ButtonMore
