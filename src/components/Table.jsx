import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

// TODO
const Table = component(({ columns, data }) => {
  const headings = []
  for (let i = 0, len = columns.length; i < len; i++) {
    const title = columns[i].title
    headings.push(<th key={columns.key}>{title}</th>)
  }

  const rows = []
  for (let i = 0, len = data.length; i < len; i++) {
    const record = data[i]
    const cells = []
    for (let c = 0, len = record.length; c < len; c++) {

    }
    rows.push(<tr key={record.key}>{cells}</tr>)
  }

  return (
    <table>
      <thead>
        <tr>{headings}</tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
})

Table.Title = component(() => { })

Table.Footer = component(({ showing, total, previous, next }) => {
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

export default Table
