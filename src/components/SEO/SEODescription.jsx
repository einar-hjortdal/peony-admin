import { component, detectIsUndefined } from '@dark-engine/core'

import Text from '../input/Text'

// limit 191 characters
const SEODescription = component(({ seo, onInput, disabled, slot }) => {
  const getSEODescription = () => {
    if (detectIsUndefined(seo)) {
      return
    }

    const { description } = seo
    if (detectIsUndefined(description)) {
      return
    }

    return description
  }

  return (
    <Text
      name='description'
      onInput={onInput}
      value={getSEODescription()}
      disabled={disabled}
    >{slot}
    </Text>
  )
})

export default SEODescription
