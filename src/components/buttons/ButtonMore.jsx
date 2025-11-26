import { component, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import If from '../If'
import HorizontalDots from '../svg/HorizontalDots'

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

  & li button:disabled {
    background-color: ${p => p.theme.neutral20};
  }

  & li button:hover {
    color: ${p => p.theme.bg};
    background-color: ${p => p.theme.active};
  }

  & li button:hover:disabled {
    color: inherit;
    background-color: ${p => p.theme.neutral20};
    cursor: auto;
  }
`

const ButtonMore = component(({ slot }) => {
  const { t } = useTranslation('buttons.more')
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <StyledDiv>
      <StyledButton aria-label={t('label')} type='button' onClick={handleClick}>
        <HorizontalDots />
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
