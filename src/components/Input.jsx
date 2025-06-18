import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Label = styled.label`
  
`

const Input = styled.div`
  
`

const Text = styled.input``

Input.Text = component(({ ...props }) => {
  return (
    <Label>
      <Text {...props} />
    </Label>
  )
})

const Switch = styled.input`
  margin: 0;
  pointer-events: none;
`

Input.Switch = component(({ slot, ...props }) => {
  return (
    <Label>
      {slot}
      <Switch type='checkbox' {...props} />
    </Label>
  )
})

export default Input
