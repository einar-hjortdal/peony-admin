import { component, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import Text from '../input/Text'
import Textarea from '../input/Textarea'
import { detectIsEmptyString } from '@wareme/utils'

const TranslationInputs = component(({ localeId, translations, onChange }) => {
  const { t } = useTranslation('categories.translationInputs')

  const translationData = useMemo(() => {
    if (detectIsUndefined(translations)) {
      return {}
    }

    const translation = translations[localeId]
    if (detectIsUndefined(translation)) {
      return {}
    }

    return translation
  }, [translations])

  const handleInput = (e) => {
    const { name, value } = e.target
    const newTranslationData = { ...translationData }
    if (detectIsEmptyString(value)) {
      delete newTranslationData[name]
    } else {
      newTranslationData[name] = value
    }

    if (detectIsUndefined(translations)) {
      return onChange({ [localeId]: newTranslationData })
    }

    return onChange({ ...translations, [localeId]: newTranslationData })
  }

  const { name, description } = translationData

  return (
    <>
      <Text
        name='name'
        data-locale-id={localeId}
        value={name}
        onInput={handleInput}
      >{t('name')}
      </Text>

      <Textarea
        name='description'
        data-locale-id={localeId}
        value={description}
        onInput={handleInput}
      >{t('description')}
      </Textarea>
    </>
  )
})

export default TranslationInputs
