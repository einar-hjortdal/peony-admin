import { component, detectIsString, detectIsUndefined, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useUser, useUserLogoutMutation } from '../data'
import If from '../components/If'

const StyledDiv = styled.div`
  position: relative;
  display: inline-block;
  padding-top: .375rem;
  padding-right: .375rem;
  padding-bottom: .375rem;
  padding-left: .375rem;
  border-radius: 20rem;
  border: 1px solid ${p => p.theme.neutral30};
  vertical-align: middle;
`

const UserButton = styled.button`
  height: 2.25rem;
  background-color: ${p => p.theme.bg};
  border-radius: 50%;
  cursor: pointer;
  text-align: left;
`

const NameSpan = styled.span`
  font-weight: 700;
  display: block;
  font-size: .625rem;
`

const EmailSpan = styled.span`
  display: block;
  font-size: .625rem;
`

const StyledUl = styled.ul`
  position: absolute;
  border-radius: .3rem;
  top: 1.5rem;
  right: 0;
  white-space: nowrap;
  background-color: ${p => p.theme.bg};
  box-shadow: 0 .2rem 1.5rem 0 rgba(0, 0, 0, 0.25);
  padding-top: .3rem;
  padding-right: .3rem;
  padding-bottom: .3rem;
  padding-left: .3rem;
  min-width: 8rem;

  & li button {
    width: 100%;
    border-radius: .3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    text-align: left;
    cursor: pointer;
    color: inherit;
    background-color: inherit;
  }

  & li button:hover {
    color: ${p => p.theme.bg};
    background-color: ${p => p.theme.active};
  }
`

const User = component(() => {
  const { t } = useTranslation('layout.user')
  const [menuIsShown, setMenuIsShown] = useState(false)
  const { data: userData } = useUser()
  const [logout, { isFetching: logoutIsFetching }] = useUserLogoutMutation()

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
    const { handle, email, role, firstName, lastName, metadata, image } = userData.user

    const username = []
    if (detectIsString(firstName)) {
      username.push(firstName)
    }

    if (detectIsString(lastName)) {
      username.push(lastName)
    }

    let nameSpanContent = username.join(' ')
    if (nameSpanContent === '') {
      nameSpanContent = 'John Doe'
    }

    return (
      <StyledDiv>
        <UserButton type='button' onClick={handleShowMenu}>
          <NameSpan>{nameSpanContent}</NameSpan>
          <EmailSpan>{email}</EmailSpan>
        </UserButton>

        <If condition={menuIsShown}>
          <StyledUl>
            <li>
              <button
                type='button'
                disabled={logoutIsFetching}
                onClick={handleLogout}
              >{t('logout')}
              </button>
            </li>
          </StyledUl>
        </If>
      </StyledDiv>
    )
  }

  return null
})

export default User
