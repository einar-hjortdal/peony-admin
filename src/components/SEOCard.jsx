import { component, detectIsString, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useStore } from '../data'
import CardDefault from './cards/CardDefault'
import CardHeader from './cards/CardHeader'
import Handle from './input/Handle'
import Text from './input/Text'

const SEOTranslationInputs = component(({ localeId, seo, onChange }) => {
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

    return onChange(newSeoTranslations)
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

const SEOTranslations = component(({ seo, onChange }) => {
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
            onChange={onChange}
          />
          {/* TODO delete button */}
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

const SEOTitle = component(({ seo, onInput }) => {
  const { t } = useTranslation('seoCard')
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
    >{t('seoTitle')}
    </Text>
  )
})

const SEODescription = component(({ seo, onInput }) => {
  const { t } = useTranslation('seoCard')
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
    >{t('seoDescription')}
    </Text>
  )
})

const SEOCard = component(({ handle, seo, onChange }) => {
  const { t } = useTranslation('seoCard')

  const handleHandleInput = (newHandle) => {
    onChange({ handle: newHandle })
  }

  const handleSEOInput = (event) => {
    const { name, value } = event.target
    if (detectIsUndefined(seo)) {
      const newSeo = { [name]: value }
      onChange({ seo: newSeo })
      return
    }

    const newSeo = { ...seo }
    if (detectIsEmptyString(value)) {
      delete newSeo[name]
    } else {
      newSeo[name] = value
    }
    onChange({ seo: newSeo })
  }

  const handleSEOTranslationInput = (newSEOTranslations) => {
    const cleanedTranslations = []
    for (let i = 0, len = newSEOTranslations.length; i < len; i++) {
      const seoTranslation = newSEOTranslations[i]
      const { title, description } = seoTranslation
      if (detectIsString(title) || detectIsString(description)) {
        cleanedTranslations.push(seoTranslation)
      }
    }
    onChange({ seoTranslations: cleanedTranslations })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Handle
        name='handle'
        onInput={handleHandleInput}
        value={handle}
      />

      <SEOTitle seo={seo} onInput={handleSEOInput} />
      <SEODescription seo={seo} onInput={handleSEOInput} />
      <SEOTranslations seo={seo} onChange={handleSEOTranslationInput} />
    </CardDefault>
  )
})

export default SEOCard
