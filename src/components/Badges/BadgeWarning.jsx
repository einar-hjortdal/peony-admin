import { styled } from '@dark-engine/styled'

import { base } from './base'

const BadgeWarning = styled.span`
  ${base}
  color: ${p => p.theme.warning};
  border-color: ${p => p.theme.warning};
`

export default BadgeWarning
