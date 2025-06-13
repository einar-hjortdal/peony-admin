import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

const Nav = styled.nav`
`

const Menu = component(() => {
  return (
    <>
      <div>
        user name
      </div>
      <div>
        log out button
      </div>
      <div>
        store title
      </div>
      <div>
        store name
      </div>

      <Nav>
        links
      </Nav>
    </>
  )
})

export default Menu
