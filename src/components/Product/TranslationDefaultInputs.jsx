import { component, detectIsArray, detectIsUndefined, useEffect, useState } from '@dark-engine/core'

import Input from '../Input'
import { useStore } from '../../data'
import { useTranslation } from '@wareme/translations'

// Should be out inside a form element
const TranslationDefaultInputs = component(({ translations, onChange }) => {
  const { t } = useTranslation('translationDefaultInputs')
  const { data: storeData } = useStore()

  const [translationData, setTranslationData] = useState({})
  useEffect(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      // translations is either undefined or an array with at least one object
      if (detectIsArray(translations)) {
        for (let i = 0, len = translations.length; i < len; i++) {
          if (translations[i].localeId === defaultLocaleId) {
            return setTranslationData(translations[i])
          }
        }
      }

      return setTranslationData({ localeId: defaultLocaleId })
    }
  }, [translations, storeData])

  const handleInput = (e) => {
    const { name, value } = e.target
    const { localeId } = e.target.dataset

    const newTranslationData = { ...translationData, [name]: value }
    const newTranslations = []

    if (detectIsArray(translations)) {
      for (let i = 0, len = translations.length; i < len; i++) {
        if (translations[i].localeId === localeId) {
          newTranslations.push(newTranslationData)
        } else {
          newTranslations.push(translations[i])
        }
      }
    }

    if (detectIsUndefined(translations)) {
      newTranslations.push(newTranslationData)
    }

    setTranslationData(newTranslationData)
    onChange(newTranslations)
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store

    return (
      <>
        <Input
          name='title'
          data-locale-id={defaultLocaleId}
          onInput={handleInput}
          required
        >{t('title')}
        </Input>
        <Input
          name='subtitle'
          data-locale-id={defaultLocaleId}
          onInput={handleInput}
        >{t('subtitle')}
        </Input>
        <Input
          name='description'
          data-locale-id={defaultLocaleId}
          onInput={handleInput}
        >{t('description')}
        </Input>
      </>
    )
  }
})

export default TranslationDefaultInputs
