import { component, useId } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { i32Max, i32Min } from '../../utils'

const Label = styled.label`
  display: block;
`

const StyledInput = styled.input`
  display: block;
`

const I32 = component(({ slot, ...props }) => {
  const id = useId()
  return (
    <>
      <Label for={id}>{slot}</Label>
      <StyledInput
        id={id}
        type='number'
        min={i32Min}
        max={i32Max}
        {...props}
      />
    </>
  )
})

export default I32
