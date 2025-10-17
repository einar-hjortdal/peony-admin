import { component, detectIsString } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import If from '../If'

const StyledHeader = styled.header`
  display: flow-root;
  padding-bottom: 1.5rem;
`

const HeaderLeft = styled.div`
  display: inline-block;
`

const HeaderRight = styled.div`
  float: right;
`

const Title = styled.span`
  display: block;
  font-size: 130%;
`

const Subtitle = styled.span`
  display: block;
  color: ${p => p.theme.neutral70};
`

const CardHeader = component(({ title, subtitle, slot }) => {
  return (
    <StyledHeader>
      <HeaderLeft>
        <If condition={detectIsString(title)}>
          <Title>{title}</Title>
        </If>
        <If condition={detectIsString(subtitle)}>
          <Subtitle>{subtitle}</Subtitle>
        </If>
      </HeaderLeft>

      <HeaderRight>
        {slot}
      </HeaderRight>
    </StyledHeader>
  )
})

export default CardHeader
