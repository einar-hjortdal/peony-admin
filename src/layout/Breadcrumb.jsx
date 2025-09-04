import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Wrapper = styled.div`
  margin-top: .75rem;
  margin-bottom: .75rem;
`

const Breadcrumb = component(() => {
  return (
    <Wrapper>
      <span>page name</span>
      {/* TODO breadcrumb */}
    </Wrapper>
  )
})

export default Breadcrumb
