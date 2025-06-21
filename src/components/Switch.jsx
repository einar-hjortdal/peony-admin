import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Input = styled.input`
  margin: 0;
  pointer-events: none;
`

const Switch = component(({ slot, ...props }) => {
  return (
    <div>
      <label>
        {slot}
        <Input type='checkbox' {...props} />
      </label>
    </div>
  )
})

export default Switch
