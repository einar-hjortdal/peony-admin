import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { SmoothScrollingProvider } from '@wareme/smooth-scrolling'
import { useTranslation } from '@wareme/translations'

import { useUser } from '../data'
import Navigate from '../components/Navigate'
import Theme from '../styles/Theme'
import Menu from './Menu'

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

const MenuWrapper = styled.aside`
  position: absolute;
  inset: 0 auto 0 0;
  width: 20%;
`

const PageWrapper = styled.main`
  margin: 0 0 0 auto;
  width: 80%;
`

const Root = component(({ slot }) => {
  return (
    <Theme>
      <Gate>
        <MenuWrapper>
          <Menu />
        </MenuWrapper>
        <PageWrapper>
          <SmoothScrollingProvider>
            {slot}
          </SmoothScrollingProvider>
        </PageWrapper>
      </Gate>
    </Theme>
  )
})

export default Root
