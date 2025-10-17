import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

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
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  border-bottom: 1px solid ${p => p.theme.neutral30};
`

const ModalHeader = component(({ title, handleClose }) => {
  return (
    <StyledHeader>
      <HeaderLeft>
        <Title>{title}</Title>
      </HeaderLeft>

      <HeaderRight>
        <button type='button' onClick={handleClose}>x</button>
      </HeaderRight>
    </StyledHeader>
  )
})

export default ModalHeader
