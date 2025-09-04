import { styled } from '@dark-engine/styled'

const Card = styled.div`
  background-color: ${p => p.theme.cardBg};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
`

Card.Header = styled.header`
  display: flex;
`

Card.HeaderTitle = styled.h1`
  flex: 1;
  font-weight: 500;
  line-height: 1.2;
`

export default Card
