import { component, detectIsUndefined } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import Handle from '../input/Handle'
import SEOTitle from './SEOTitle'
import SEODescription from './SEODescription'

const SEOCard = component(({ handle, seo, onHandleInput, onSEOInput }) => {
  const { t } = useTranslation('seoCard')

  const handleHandleInput = (newHandle) => {
    onHandleInput(newHandle)
  }

  const handleSEOInput = (event) => {
    const { name, value } = event.target
    if (detectIsUndefined(seo)) {
      const newSeo = { [name]: value }
      onSEOInput(newSeo)
      return
    }

    const newSeo = { ...seo }
    if (detectIsEmptyString(value)) {
      delete newSeo[name]
    } else {
      newSeo[name] = value
    }
    onSEOInput(newSeo)
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
    </CardDefault>
  )
})

export default SEOCard
