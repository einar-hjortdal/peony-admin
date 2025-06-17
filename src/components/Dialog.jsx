import { styled } from '@dark-engine/styled'

const Dialog = styled.dialog`
  border: none;
  max-width: unset;
  max-height: unset;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`

Dialog.Header = styled.header`
  background-color: ${p => p.theme.dialogHeaderBg};
  color: ${p => p.theme.dialogHeaderFg};
  display: flex;
`

Dialog.Title = styled.h1`
  flex: 1;
`

Dialog.Close = styled.button`
`

Dialog.Footer = styled.footer`
  display: flex;
  justify-content: end;
`

export default Dialog
