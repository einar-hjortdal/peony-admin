import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Card = styled.div`
  box-shadow: 0 3px 16px rgba(142,134,171,.05);
`

Card.Header = styled.header`
  display: flex;
  padding: 1.5rem;
`

Card.HeaderTitle = styled.h1`
  flex: 1;
  font-weight: 500;
  line-height: 1.2;
`

Card.HeaderFilter = component(() => {
  return (
    <div>
      filter
    </div>
  )
})

const ButtonWrapper = styled.div`
  padding: 0.125rem 0.25rem;
`

const Button = styled.button`
  background-color: ${p => p.theme.buttonBg};
  color: ${p => p.theme.buttonFg};
  border: none;
  border-radius: .5rem;
  font-weight: 500;
  padding: .5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${p => p.theme.buttonHoverBg};
  }
`

Card.HeaderButton = component(({ slot, ...props }) => {
  return (
    <ButtonWrapper>
      <Button {...props}>{slot}</Button>
    </ButtonWrapper>
  )
})

const Table = styled.table``

Card.Table = component(({ headings }) => {
  const h = []
  for (let i = 0, len = headings.length; i < len; i++) {
    h.push(<th key={headings[i]}>{headings[i]}</th>)
  }

  return (
    <Table>
      <thead><tr>{h}</tr></thead>
      <tbody>
        <tr>
          tbr
        </tr>
      </tbody>
    </Table>
  )
})

Card.TableFooter = component(({ showing, total, previous, next }) => {
  return (
    <div>
      <div>
        showing x out of y
      </div>
      <nav>
        <ul>
          <li>prev</li>
          <li>next</li>
        </ul>
      </nav>
    </div>
  )
})

export default Card
