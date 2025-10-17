import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Outer = styled.div`
  box-sizing: border-box;
  padding-right: .75rem;
  padding-left: .75rem;
`
const Inner = styled.div`
  background-color: ${p => p.theme.neutral00};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
`

const CardDefault = component(({ slot }) => {
  return (
    <Outer>
      <Inner>
        {slot}
      </Inner>
    </Outer>
  )
})

export default CardDefault
