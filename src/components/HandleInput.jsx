import { component } from '@dark-engine/core'

import Input from './Input'
import { useTranslation } from '@wareme/translations'

const HandleInput = component(({ value, onChange }) => {
  const { t } = useTranslation('handleInput')

  const handleInput = (e) => {
    onChange(e.target.value)
  }

  // TODO placeholder

  return (
    <Input
      name='handle'
      onInput={handleInput}
      value={value}
    // placeholder={placeholder}
    >{t('handle')}
    </Input>
  )
})

export default HandleInput
