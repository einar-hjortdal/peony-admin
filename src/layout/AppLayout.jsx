import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
// import { useInView } from '@wareme/use-in-view'

const StyledMain = styled.main`
`

const AppLayout = component(({ slot }) => {
  return (
    <StyledMain>
      {slot}
    </StyledMain>
  )
})

export default AppLayout
