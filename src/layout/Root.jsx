import { component } from '@dark-engine/core'

import { useUser } from '../data'
import Navigate from '../components/Navigate'
import Theme from '../styles/Theme'
import AppLayout from './AppLayout'
import { SmoothScrollingProvider } from '@wareme/smooth-scrolling'

const Root = component(({ slot }) => {
  const { isFetching, error } = useUser()

  if (isFetching) {
    return (
      <div>
        loading...
      </div>
    )
  }

  if (error) {
    return <Navigate to='/login' />
  }

  return (
    <Theme>
      <SmoothScrollingProvider>
        <AppLayout>
          {slot}
        </AppLayout>
      </SmoothScrollingProvider>
    </Theme>
  )
})

export default Root
