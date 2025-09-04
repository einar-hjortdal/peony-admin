import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Wrapper = styled.div`
  box-sizing: border-box;
  padding-top: .75rem;
  padding-bottom: .75rem;
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
