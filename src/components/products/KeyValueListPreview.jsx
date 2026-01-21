import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { formatLine } from '../../utils'

const StyledUl = styled.ul`
  & li {
    padding-top: .75rem;
    padding-bottom: .75rem;
    border-bottom: 1px solid ${(p) => p.theme.neutral20};
  }
`

const Column = styled.div`
  display: inline-block;
  width: 50%;
`

const KeyValueListPreview = component(({ keys, values }) => {
  const res = []
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    const value = values[i]
    res.push(
      <li>
        <Column>{key}</Column>
        <Column>{formatLine(value)}</Column>
      </li>
    )
  }
  return (
    <StyledUl>
      {res}
    </StyledUl>
  )
})

export default KeyValueListPreview
