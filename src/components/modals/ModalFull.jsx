import { styled } from '@dark-engine/styled'

const ModalFull = styled.dialog`
  background-color: ${p => p.theme.bg};
  color: ${p => p.theme.fg};
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`

export default ModalFull
