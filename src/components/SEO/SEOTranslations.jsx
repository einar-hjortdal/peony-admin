import { component, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useStore } from '../../data'
import Text from '../input/Text'

const SEOTranslationInputs = component(({ localeId, seo, onInput }) => {
  const { t } = useTranslation('seoCard')

  const seoTranslationData = useMemo(() => {
    const newSEOTranslation = { localeId }
    if (detectIsUndefined(seo)) {
      return newSEOTranslation
    }

    const { translations } = seo
    if (detectIsUndefined(translations)) {
      return newSEOTranslation
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const seoTranslation = translations[i]
      if (seoTranslation.localeId === localeId) {
        return seoTranslation
      }
    }

    return newSEOTranslation
  }, [seo])

  const handleInput = (e) => {
    const { name, value } = e.target
    const newSeoTranslationData = { ...seoTranslationData }
    if (detectIsEmptyString(value)) {
      delete newSeoTranslationData[name]
    } else {
      newSeoTranslationData[name] = value
    }
    const newSeoTranslations = [newSeoTranslationData]

    if (seo && seo.translations) {
      const { translations } = seo
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId !== seoTranslationData.localeId) {
          newSeoTranslations.push(translation)
        }
      }
    }

    return onInput(newSeoTranslations)
  }

  const { title, description } = seoTranslationData

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

const SEOTranslations = component(({ seo, onInput }) => {
  const { translator } = useTranslation()
  const { data: storeData } = useStore()
  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    if (locales.length === 1) {
      return null
    }

    const res = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      const { id, code } = locale
      if (id === defaultLocaleId) {
        continue
      }

      const languageName = translator.formatName(code, { type: 'language' })

      res.push(
        <li key={id}>
          <div>{languageName}</div>
          <SEOTranslationInputs
            seo={seo}
            localeId={id}
            onInput={onInput}
          />
          {/* TODO delete button (remove translation from object) */}
        </li>
      )
    }

    return (
      <ul>
        {res}
      </ul>
    )
  }
})

export default SEOTranslations
