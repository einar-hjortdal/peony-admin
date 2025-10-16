import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Text from './Text'

const Handle = component(({ value, onChange }) => {
  const { t } = useTranslation('handleInput')

  const handleInput = (e) => {
    onChange(e.target.value)
  }

  // TODO formatted placeholder using placeholder prop

  return (
    <Text
      name='handle'
      onInput={handleInput}
      value={value}
    // placeholder={placeholder}
    >{t('handle')}
    </Text>
  )
})

export default Handle
