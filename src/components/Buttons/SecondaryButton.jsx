import { styled } from '@dark-engine/styled'
import { base } from './baseButton'

const SecondaryButton = styled.button`
  ${base}
  background-color: ${p => p.theme.button.secondary.bg};
  color: ${p => p.theme.button.secondary.fg};
  &:hover {
    background-color: ${p => p.theme.button.secondary.hoverBg};
  }
`

export default SecondaryButton
