import { component, useId } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Label = styled.label`
  display: inline-block;
`

const StyledInput = styled.input`
  display: inline-block;
`

const Checkbox = component(({ slot, ...props }) => {
  const id = useId()

  return (
    <>
      <StyledInput id={id} type='checkbox' {...props} />
      <Label for={id}>{slot}</Label>
    </>
  )
})

export default Checkbox
