import { component, useId } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Label = styled.label`
  display: block;
`

const StyledInput = styled.input`
  display: block;
`

const Text = component(({ slot, ...props }) => {
  const id = useId()
  return (
    <>
      <Label for={id}>{slot}</Label>
      <StyledInput id={id} type='text' {...props} />
    </>
  )
})

export default Text
