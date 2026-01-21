import { component, detectIsString, detectIsUndefined } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import Handle from '../input/Handle'
import SEOTitle from './SEOTitle'
import SEODescription from './SEODescription'
import SEOTranslations from './SEOTranslations'

const SEOCard = component(({ handle, seo, onInput }) => {
  const { t } = useTranslation('seoCard')

  const handleHandleInput = (newHandle) => {
    onInput({ handle: newHandle })
  }

  const handleSEOInput = (event) => {
    const { name, value } = event.target
    if (detectIsUndefined(seo)) {
      const newSeo = { [name]: value }
      onInput({ seo: newSeo })
      return
    }

    const newSeo = { ...seo }
    if (detectIsEmptyString(value)) {
      delete newSeo[name]
    } else {
      newSeo[name] = value
    }
    onInput({ seo: newSeo })
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
    onInput({ seoTranslations: cleanedTranslations })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Handle
        name='handle'
        onInput={handleHandleInput}
        value={handle}
      />

      <SEOTitle seo={seo} onInput={handleSEOInput}>{t('seoTitle')}</SEOTitle>
      <SEODescription seo={seo} onInput={handleSEOInput}>{t('seoDescription')}</SEODescription>
      <SEOTranslations seo={seo} onInput={handleSEOTranslationInput} />
    </CardDefault>
  )
})

export default SEOCard
