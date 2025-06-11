import { component } from '@dark-engine/core'

import { useUser } from '../data'
import Navigate from '../components/Navigate'
import Theme from '../styles/Theme'
import AppLayout from './AppLayout'

const Root = component(({ slot }) => {
  const { error } = useUser()

  if (error) {
    return <Navigate to='/login' />
  }

  return (
    <Theme>
      <AppLayout>
        {slot}
      </AppLayout>
    </Theme>
  )
})

export default Root
