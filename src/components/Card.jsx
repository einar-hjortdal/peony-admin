import { styled } from '@dark-engine/styled'

const Card = styled.div`
  box-shadow: 0 3px 16px rgba(142,134,171,.05);
  padding: 1.5rem;
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
