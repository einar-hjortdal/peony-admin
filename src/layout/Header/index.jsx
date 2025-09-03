import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import User from './User'
import Language from './Language'
import Theme from './Theme'

const Header = component(() => {
  const { t } = useTranslation('header')

  return (
    <div>
      <Theme />
      <Language />
      {/* TODO notifications */}
      <User />
    </div>
  )
})

export default Header
