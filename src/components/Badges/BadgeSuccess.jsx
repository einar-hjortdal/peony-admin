import { styled } from '@dark-engine/styled'

import { base } from './base'

const BadgeSuccess = styled.span`
  ${base}
  color: ${p => p.theme.success};
  border-color: ${p => p.theme.success};
`

export default BadgeSuccess
