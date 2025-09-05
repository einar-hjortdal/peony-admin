import { styled } from '@dark-engine/styled'
import { base } from './baseButton'

const PrimaryButton = styled.button`
  ${base}
  background-color: ${p => p.theme.button.primary.bg};
  color: ${p => p.theme.button.primary.fg};
  &:hover {
    background-color: ${p => p.theme.button.primary.hoverBg};
  }
`

export default PrimaryButton
