import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Wrapper = styled.div``

const Title = styled.div``

const Header = styled.div``

const AccordionItem = component(({ title, slot }) => {
  return (
    <Wrapper>
      <Header>
        <Title>{title}</Title>
      </Header>
      <div>
        {slot}
      </div>
    </Wrapper>
  )
})

export default AccordionItem
