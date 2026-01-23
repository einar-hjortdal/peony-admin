import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'
import Text from '../input/Text'
import Textarea from '../input/Textarea'

const TranslationInputs = component(({ generalTranslation, onInput }) => {
  const { t } = useTranslation('productsTranslationInputs')
  const { title, subtitle, description } = generalTranslation

  const handleInput = (event) => {
    const { name, value } = event.target
    const newTranslation = { ...generalTranslation }
    if (detectIsEmptyString(value)) {
      delete newTranslation[name]
    } else {
      newTranslation[name] = value
    }
    onInput(newTranslation)
  }

  return (
    <>
      <Text
        name='title'
        value={title}
        onInput={handleInput}
      >{t('title')}:
      </Text>
      <Text
        name='subtitle'
        value={subtitle}
        onInput={handleInput}
      >{t('subtitle')}:
      </Text>
      <Textarea
        name='description'
        value={description}
        onInput={handleInput}
      >{t('description')}:
      </Textarea>
    </>
  )
})

export default TranslationInputs
