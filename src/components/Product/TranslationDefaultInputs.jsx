import { component, detectIsUndefined, useEffect, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Input from '../Input'
import { useStore } from '../../data'

const TranslationDefaultInputs = component(({ translations, onChange }) => {
  const { t } = useTranslation('translationDefaultInputs')
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
    const { title, subtitle, description } = translationData

    return (
      <>
        <Input
          name='title'
          onInput={handleInput}
          value={title}
        >{t('title')}
        </Input>
        <Input
          name='subtitle'
          onInput={handleInput}
          value={subtitle}
        >{t('subtitle')}
        </Input>
        <Input
          name='description'
          onInput={handleInput}
          value={description}
        >{t('description')}
        </Input>
      </>
    )
  }
})

export default TranslationDefaultInputs
