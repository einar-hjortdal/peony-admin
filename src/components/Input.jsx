import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Text = styled.input``

const Input = component(({ slot, ...props }) => {
  return (
    <div>
      <label>
        {slot}
        <Text type='text' {...props} />
      </label>
    </div>
  )
})

export default Input
