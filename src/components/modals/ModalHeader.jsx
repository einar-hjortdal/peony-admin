import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import ButtonClose from '../buttons/ButtonClose'

const HeaderLeft = styled.div`
  display: inline-block;
`

const HeaderRight = styled.div`
  float: right;
`

const Title = styled.span`
  display: block;
  font-size: 130%;
`

const StyledHeader = styled.header`
  display: flow-root;
  padding-bottom: 1.5rem;
`

const ModalHeader = component(({ title, handleClose }) => {
  return (
    <StyledHeader>
      <HeaderLeft>
        <Title>{title}</Title>
      </HeaderLeft>

      <HeaderRight>
        <ButtonClose type='button' onClick={handleClose}>x</ButtonClose>
      </HeaderRight>
    </StyledHeader>
  )
})

export default ModalHeader
