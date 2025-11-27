import { component, detectIsUndefined, useEffect, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import Text from '../input/Text'
import Textarea from '../input/Textarea'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'

// TODO export inputs only, wrapper component in NewCategory and Category
const TranslationDefault = component(({ translations, onChange }) => {
  const { t } = useTranslation('categories.translationDefault')
  const { data: storeData } = useStore()

  useEffect(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      if (detectIsUndefined(translations)) {
        onChange([{ localeId: defaultLocaleId }])
      }
    }
  }, [translations, storeData])

  const translationData = useMemo(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      if (detectIsUndefined(translations)) {
        return
      }

      for (let i = 0, len = translations.length; i < len; i++) {
        if (translations[i].localeId === defaultLocaleId) {
          return translations[i]
        }
      }
    }
  }, [translations, storeData])

  const handleInput = (e) => {
    const { name, value } = e.target
    const { localeId } = translationData

    const newTranslationData = { ...translationData, [name]: value }
    const newTranslations = []

    for (let i = 0, len = translations.length; i < len; i++) {
      if (translations[i].localeId === localeId) {
        newTranslations.push(newTranslationData)
      } else {
        newTranslations.push(translations[i])
      }
    }

    onChange(newTranslations)
  }

  if (storeData && translationData) {
    const { name, description } = translationData

    return (
      <CardDefault>
        <CardHeader title={t('title')} />
        <Text
          name='name'
          onInput={handleInput}
          value={name}
        >{t('name')}
        </Text>

        <Textarea
          name='description'
          onInput={handleInput}
          value={description}
        >{t('description')}
        </Textarea>
      </CardDefault>
    )
  }
})

export default TranslationDefault
