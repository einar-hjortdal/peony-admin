import { styled } from '@dark-engine/styled'

const ModalDefault = styled.dialog`
  background-color: ${p => p.theme.bg};
  color: ${p => p.theme.fg};
  box-sizing: border-box;
  width: 800px;
`

export default ModalDefault
