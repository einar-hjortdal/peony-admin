import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const StyledDialog = styled.dialog`
  background-color: ${p => p.theme.bg};
  color: ${p => p.theme.fg};
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`

const StyledHeader = styled.header`
  display: flow-root;
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  border-bottom: 1px solid ${p => p.theme.neutral30};
`

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

const Body = styled.div`
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
`

const ModalFull = component(({ title, handleClose, slot, ref }) => {
  return (
    <StyledDialog ref={ref}>
      <StyledHeader>
        <HeaderLeft>
          <Title>{title}</Title>
        </HeaderLeft>

        <HeaderRight>
          <button type='button' onClick={handleClose}>x</button>
        </HeaderRight>
      </StyledHeader>

      <Body>
        {slot}
      </Body>
    </StyledDialog>
  )
})

export default ModalFull
