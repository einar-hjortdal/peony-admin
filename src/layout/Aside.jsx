import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { NavLink } from '@dark-engine/web-router'

const Nav = styled.nav`
  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`

const Aside = component(() => {
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
        <ul>
          <li><NavLink to='/orders'>orders</NavLink></li>
          <li><NavLink to='/products'>products</NavLink></li>
          <li><NavLink to='/categories'>categories</NavLink></li>
          <li><NavLink to='/customers'>customers</NavLink></li>
          <li><NavLink to='/discounts'>discounts</NavLink></li>
          <li><NavLink to='/gift-cards'>gift cards</NavLink></li>
          <li><NavLink to='/pricing'>pricing</NavLink></li>
          <li><NavLink to='/pages'>pages</NavLink></li>
          <li><NavLink to='/posts'>posts</NavLink></li>
          <li><NavLink to='/settings'>settings</NavLink></li>
        </ul>
      </Nav>
    </>
  )
})

export default Aside
