import { component, detectIsArray, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import TranslationInputs from '../../components/products/TranslationInputs'
import SEOTranslationInputs from '../../components/SEO/SEOTranslationInputs'

// for each language return a group of inputs, general and seo
const LanguageTranslations = component(
  ({
    defaultLocaleId,
    locales,
    productData,
    handleGeneralTranslationInput,
    handleSEOTranslationInput
  }) => {
    const { t, translator } = useTranslation('newProduct.translations')
    const { translations: generalTranslations, seo } = productData
    // skip defaultLocaleId
    const translationLocales = useMemo(() => {
      const res = []
      for (let i = 0, len = locales.length; i < len; i++) {
        const locale = locales[i]
        if (locale.id === defaultLocaleId) {
          continue
        }
        res.push(locale)
      }
      return res
    }, [locales, defaultLocaleId])

    const getGeneralTranslation = (localeId) => {
      if (detectIsArray(generalTranslations)) {
        for (let i = 0, len = generalTranslations.length; i < len; i++) {
          const translation = generalTranslations[i]
          if (translation.localeId === localeId) {
            return translation
          }
        }
      }
      return { localeId }
    }

    const getSEOTranslation = (localeId) => {
      if (detectIsUndefined(seo)) {
        return { localeId }
      }

      const { translations: seoTranslations } = seo
      if (detectIsArray(seoTranslations)) {
        for (let i = 0, len = seoTranslations.length; i < len; i++) {
          const translation = seoTranslations[i]
          if (translation.localeId === localeId) {
            return translation
          }
        }
      }
      return { localeId }
    }

    const inputs = []
    for (let i = 0, len = translationLocales.length; i < len; i++) {
      const locale = translationLocales[i]
      const generalTranslation = getGeneralTranslation(locale.id)
      const seoTranslation = getSEOTranslation(locale.id)
      const languageName = translator.formatName(locale.code, { type: 'language' })

      inputs.push(
        <li key={locale.id}>
          <div>{languageName}</div>
          <div>
            {t('general')}
            <TranslationInputs
              localeId={locale.id}
              generalTranslation={generalTranslation}
              onInput={handleGeneralTranslationInput}
            />
          </div>
          <div>
            {t('seo')}
            <SEOTranslationInputs
              seoTranslation={seoTranslation}
              onInput={handleSEOTranslationInput}
            />
          </div>
        </li>
      )
    }

    return (<ul>{inputs}</ul>)
  })

// TODO maybe put seo translations in here too?
const Translations = component(
  ({
    productData,
    handleGeneralTranslationInput,
    handleSEOTranslationInput
  }) => {
    const { data: storeData } = useStore()
    const { t } = useTranslation('newProduct.translations')
    if (storeData) {
      const { defaultLocaleId, locales } = storeData.store
      if (locales.length === 1) {
        return null
      }

      return (
        <CardDefault>
          <CardHeader title={t('title')} />
          <LanguageTranslations
            defaultLocaleId={defaultLocaleId}
            locales={locales}
            productData={productData}
            handleGeneralTranslationInput={handleGeneralTranslationInput}
            handleSEOTranslationInput={handleSEOTranslationInput}
          />
        </CardDefault>
      )
    }
  }
)
export default Translations
