import { component, detectIsEmpty, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { nisha } from '@wareme/utils'

const Wrapper = styled.div`
  
`

const TitleWrapper = styled.div`
  
`

const Title = styled.span`
  font-weight: 500;
`

const Header = styled.div``

const Body = styled.div`
  display: ${p => nisha(p.$isOpen, 'block', 'none')};
`

const getDefault = (providedValue, defaultValue) => {
  if (detectIsEmpty(providedValue)) {
    return defaultValue
  }
  return providedValue
}

const AccordionItem = component(({ title, defaultOpen, slot }) => {
  const [isOpen, setIsOpen] = useState(getDefault(defaultOpen, false))
  const handleClick = () => {
    if (isOpen) {
      return setIsOpen(false)
    }
    return setIsOpen(true)
  }

  return (
    <Wrapper>
      <Header
        role='button'
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
      </Header>
      <Body $isOpen={isOpen}>
        {slot}
      </Body>
    </Wrapper>
  )
})

export default AccordionItem
