import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { NavLink } from '@dark-engine/web-router'
import { useUserLogoutMutation } from '../data'

const Nav = styled.nav`
  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`

const Aside = component(() => {
  const [
    logout,
    {
      isFetching: logoutIsFetching,
      error: logoutError
    }
  ] = useUserLogoutMutation()

  const handleLogout = () => {
    if (logoutIsFetching) {
      return
    }
    logout()
  }

  // TODO if (logoutError)

  return (
    <>
      <div>
        user name
      </div>
      <div>
        <button
          type='button'
          disabled={logoutIsFetching}
          onClick={handleLogout}
        >log out
        </button>
      </div>

      <Nav>
        <ul>
          <li><NavLink to='/orders'>orders</NavLink></li>
          <li><NavLink to='/products'>products</NavLink></li>
          <li><NavLink to='/collections'>collections</NavLink></li>
          <li><NavLink to='/categories'>categories</NavLink></li>
          <li><NavLink to='/customers'>customers</NavLink></li>
          <li><NavLink to='/groups'>groups</NavLink></li>
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
