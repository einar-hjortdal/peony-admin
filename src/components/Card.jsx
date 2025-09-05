import { component, detectIsString } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import If from './If'

const Card = styled.div`
  background-color: ${p => p.theme.neutral00};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
`

const StyledHeader = styled.header`
  display: flow-root;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
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
  color: ${p => p.theme.neutral60};
`

Card.Header = component(({ title, subtitle, slot }) => {
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

const BadgeSuccess = styled.span`
  background-color: ${p => p.theme.success};
`

Card.Header.BadgeSuccess = component(({ slot }) => {
  return (
    <BadgeSuccess>
      {slot}
    </BadgeSuccess>
  )
})

const BadgeWarning = styled.span`
  background-color: ${p => p.theme.warning};
`

Card.Header.BadgeWarning = component(({ slot }) => {
  return (
    <BadgeWarning>
      {slot}
    </BadgeWarning>
  )
})

Card.Body = styled.div`
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
`

export default Card
