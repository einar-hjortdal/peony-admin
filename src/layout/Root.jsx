import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { SmoothScrollingProvider } from '@wareme/smooth-scrolling'
import { useTranslation } from '@wareme/translations'

import { useUser } from '../data'
import Navigate from '../components/Navigate'
import Theme from '../styles/Theme'
import Header from './Header'
import Aside from './Aside'

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

const HeaderWrapper = styled.header`
  position: fixed;
  inset: 0 0 auto auto;
  height: 120px;
  width: calc(100% - 270px); // TODO put these vars in Theme to access them like colors
  background-color: ${p => p.theme.mainBg};
`

const AsideWrapper = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  width: 270px;
  background-color: ${p => p.theme.asideBg};
`

const MainWrapper = styled.main`
  background-color: ${p => p.theme.mainBg};
  width: calc(100% - 270px);
  padding: 120px 0 0 270px;
`

const Container = styled.div`
  padding: 0 8px 68px 8px;
`

const Root = component(({ slot }) => {
  return (
    <Theme>
      <Gate>
        <SmoothScrollingProvider root>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>

          <AsideWrapper>
            <Aside />
          </AsideWrapper>

          <MainWrapper>
            <Container>
              {slot}
            </Container>
          </MainWrapper>
        </SmoothScrollingProvider>
      </Gate>
    </Theme>
  )
})

export default Root
