import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import Text from '../input/Text'

const SEOTranslationInputs = component(({ seoTranslation, onInput }) => {
  const { t } = useTranslation('seoCard')

  const handleInput = (event) => {
    const { name, value } = event.target
    const newSeoTranslation = { ...seoTranslation }
    if (detectIsEmptyString(value)) {
      delete newSeoTranslation[name]
    } else {
      newSeoTranslation[name] = value
    }
    return onInput(newSeoTranslation)
  }

  const { title, description } = seoTranslation

  return (
    <>
      <Text
        name='title'
        onInput={handleInput}
        value={title}
      >{t('seoTitle')}
      </Text>

      <Text
        name='description'
        onInput={handleInput}
        value={description}
      >{t('seoDescription')}
      </Text>
    </>
  )
})

export default SEOTranslationInputs
