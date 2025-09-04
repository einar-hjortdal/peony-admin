import { component, detectIsUndefined, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { useUser, useUserLogoutMutation } from '../data'
import If from '../components/If'

const UserButton = styled.button`
  border: none;
  color: inherit;
  background-color: inherit;
  cursor: pointer;
`

const User = component(() => {
  const [menuIsShown, setMenuIsShown] = useState(false)
  const { data: userData } = useUser()
  const [
    logout,
    {
      isFetching: logoutIsFetching
      // error: logoutError TODO
    }
  ] = useUserLogoutMutation()

  const handleShowMenu = () => {
    setMenuIsShown(!menuIsShown)
  }

  const handleLogout = () => {
    if (logoutIsFetching) {
      return
    }
    logout()
  }

  if (userData) {
    const { handle, email, role, firstName, lastName, metadata } = userData.user
    return (
      <>
        <UserButton type='button' onClick={handleShowMenu}>
          <If condition={!detectIsUndefined(firstName)}>
            <span>{firstName}</span>
          </If>
          {email}
        </UserButton>

        <If condition={menuIsShown}>
          <div>
            <button
              type='button'
              disabled={logoutIsFetching}
              onClick={handleLogout}
            >log out
            </button>
          </div>
        </If>
      </>
    )
  }

  return false
})

export default User
