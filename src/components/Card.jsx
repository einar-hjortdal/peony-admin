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

Card.HeaderAdd = component(() => {
  return (
    <div>
      add
    </div>
  )
})

const Table = styled.table``

Card.Table = component(({ headings }) => {
  const h = []
  for (let i = 0, len = headings.length; i < len; i++) {
    h.push(<tr key={headings[i]}>{headings[i]}</tr>)
  }

  return (
    <Table>
      <thead>
        {h}
      </thead>
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
