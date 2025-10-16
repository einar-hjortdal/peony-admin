import { component, useId } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Label = styled.label`
  display: block;
`

const StyledTextarea = styled.textarea`
  display: block;
`

const Textarea = component(({ slot, ...props }) => {
  const id = useId()
  return (
    <>
      <Label for={id}>{slot}</Label>
      <StyledTextarea id={id} type='text' {...props} />
    </>
  )
})

export default Textarea
