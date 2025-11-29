import { component, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import Text from '../input/Text'
import Textarea from '../input/Textarea'
import { detectIsEmptyString } from '@wareme/utils'

const TranslationInputs = component(({ localeId, translations, onChange }) => {
  const { t } = useTranslation('categories.translationInputs')

  const translationData = useMemo(() => {
    const newTranslation = { localeId }
    if (detectIsUndefined(translations)) {
      return newTranslation
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const translation = translations[i]
      if (translation.localeId === localeId) {
        return translation
      }
    }

    return newTranslation
  }, [translations])

  const handleInput = (e) => {
    const { name, value } = e.target
    const newTranslationData = { ...translationData }
    if (detectIsEmptyString(value)) {
      delete newTranslationData[name]
    } else {
      newTranslationData[name] = value
    }

    const newTranslations = [newTranslationData]
    if (translations) {
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId !== translationData.localeId) {
          newTranslations.push(translation)
        }
      }
    }

    return onChange(newTranslations)
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
