import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import PrimaryButton from '../Buttons/PrimaryButton'

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

const ModalFull = component(({ title, handleClose, ref, slot }) => {
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

      {slot}
    </StyledDialog>
  )
})

ModalFull.Body = styled.div`
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
`

ModalFull.Footer = styled.footer`
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  border-top: 1px solid ${p => p.theme.neutral30};
`

export default ModalFull
