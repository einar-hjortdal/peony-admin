import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { NavLink } from '@dark-engine/web-router'
import { SmoothScrollingProvider } from '@wareme/smooth-scrolling'
import { useTranslation } from '@wareme/translations'

import { useUser } from '../data'
import Navigate from '../components/Navigate'
import Theme from '../styles/Theme'
import ThemeSwitch from './ThemeSwitch'
import LanguageSelect from './LanguageSelect'
import User from './User'
import Breadcrumb from './Breadcrumb'

const Gate = component(({ slot }) => {
  const { t } = useTranslation('root')
  const { isFetching, error } = useUser()

  if (isFetching) {
    return (
      <div>
        {t('loading')}...
      </div>
    )
  }

  if (error) {
    return <Navigate to='/login' />
  }

  return slot
})

const StyledAside = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  border-right: 1px solid ${p => p.theme.borderColor};
  width: ${p => p.theme.asideWidth};
`

const Peony = styled.a`
  display: block;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  font-size: 2.5vw;
`

const Nav = styled.nav`
  padding-top: 3rem;
  padding-right: 1.5rem;
  padding-bottom: 3rem;
  padding-left: 1.5rem;
  & ul li a {
    display: block;
    padding-top: 1rem;
    padding-bottom: 1rem;
    transition: color .2s ease-in-out;
  }
  & ul li a.active-link,
  & ul li a:hover {
    color: ${p => p.theme.active}
  }
`

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${p => p.theme.asideWidth};
  height: ${p => p.theme.headerHeight};
  border-bottom: 1px solid ${p => p.theme.borderColor};
  align-content: center;
  padding-left: .75rem;
  padding-right: .75rem;
`

const StyledMain = styled.main`
  box-sizing: border-box;
  padding-top: ${p => p.theme.headerHeight};
  padding-left: ${p => p.theme.asideWidth};
`

const Container = styled.div`
  max-width: 1300px;
  margin-right: auto;
  margin-left: auto;
  padding-left: .75rem;
  padding-right: .75rem;
  padding-bottom: 4rem;
`

const Layout = component(({ slot }) => {
  return (
    <Theme>
      <Gate>
        <SmoothScrollingProvider root>
          <StyledHeader>
            <ThemeSwitch />
            <LanguageSelect />
            {/* TODO notifications */}
            <User />
          </StyledHeader>

          <StyledAside>
            <Peony href='https://github.com/einar-hjortdal/peony'>peony</Peony>
            <Nav>
              <ul>
                <li><NavLink to='/orders'>orders</NavLink></li>
                <li><NavLink to='/products'>products</NavLink></li>
                {/* <li><NavLink to='/collections'>collections</NavLink></li> */}
                <li><NavLink to='/categories'>categories</NavLink></li>
                {/* <li><NavLink to='/customers'>customers</NavLink></li> */}
                {/* <li><NavLink to='/groups'>groups</NavLink></li> */}
                {/* <li><NavLink to='/discounts'>discounts</NavLink></li> */}
                {/* <li><NavLink to='/gift-cards'>gift cards</NavLink></li> */}
                <li><NavLink to='/pricing'>pricing</NavLink></li>
                {/* <li><NavLink to='/pages'>pages</NavLink></li> */}
                {/* <li><NavLink to='/posts'>posts</NavLink></li> */}
                <li><NavLink to='/settings'>settings</NavLink></li>
              </ul>
            </Nav>
          </StyledAside>

          <StyledMain>
            <Container>
              <Breadcrumb />
              {slot}
            </Container>
          </StyledMain>

        </SmoothScrollingProvider>
      </Gate>
    </Theme>
  )
})

export default Layout
