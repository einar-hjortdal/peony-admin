import { styled } from '@dark-engine/styled'

const ModalDefault = styled.dialog`
  border-radius: .75rem;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
  background-color: ${p => p.theme.bg};
  color: ${p => p.theme.fg};
  box-sizing: border-box;
  width: 800px;
`

export default ModalDefault
