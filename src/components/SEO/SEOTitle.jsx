import { component, detectIsUndefined } from '@dark-engine/core'

import Text from '../input/Text'

// limit 63 characters
const SEOTitle = component(({ seo, onInput, slot }) => {
  const getSEOTitle = () => {
    if (detectIsUndefined(seo)) {
      return
    }

    const { title } = seo
    if (detectIsUndefined(title)) {
      return
    }

    return title
  }

  return (
    <Text
      name='title'
      onInput={onInput}
      value={getSEOTitle()}
    >{slot}
    </Text>
  )
})

export default SEOTitle
