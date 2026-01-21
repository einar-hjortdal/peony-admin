import { component, detectIsUndefined, useState } from '@dark-engine/core'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import Handle from '../input/Handle'
import { useTranslation } from '@wareme/translations'
import SEOTitle from './SEOTitle'
import SEODescription from './SEODescription'
import KeyValueListPreview from '../products/KeyValueListPreview'

// TODO preview data without input elements
// TODO button to open modal, modal does the editing, internal state is kept until saved
// TODO button to delete data
const SEOUpdateCard = component(
  ({
    productId,
    handle,
    onHandleChange,
    seo,
    onSEOChange,
    onSEODelete,
    disabled
  }) => {
    const { t } = useTranslation('product.seoUpdateCard')

    const [seoData, setSeoData] = useState(seo)
    const [handleData, setHandleData] = useState(handle)

    const handleInput = (event) => {
      const { name, value } = event.target
      if (name === 'handle') {
        setHandleData(value)
      }

      if (name === 'title' || name === 'description') {
        setSeoData((prevState) => {
          return { ...prevState, [name]: value }
        })
      }
    }

    const handleSEOTranslationInput = (event) => {
      const { name, value, dataset } = event.target
      const { localeId } = dataset
      setSeoData((prevState) => {
        const newSEOData = { ...prevState }
        const { translations } = newSEOData

        if (detectIsUndefined(translations)) {
          newSEOData.translations = [{ localeId, [name]: value }]
          return newSEOData
        }

        for (let i = 0, len = translations.length; i < len; i++) {
          const translation = translations[i]
          if (translation.localeId === localeId) {
            const newTranslations = [...translations]
            newTranslations[i] = { ...translation, [name]: value }
            newSEOData.translations = newTranslations
            return newSEOData
          }
        }

        newSEOData.translations = [...translations, { localeId, [name]: value }]
        return newSEOData
      })
    }

    const handleSave = () => {
      onHandleChange(handleData)
      onSEOChange(seoData)
    }

    const handleDelete = () => {
      onSEODelete()
    }

    const getTitle = () => {
      if (seo && seo.title) {
        return seo.title
      }
    }

    const getDescription = () => {
      if (seo && seo.description) {
        return seo.description
      }
    }

    const previewKeys = ['handle', 'title', 'description']
    const previewValues = [handle, getTitle(), getDescription()]

    return (
      <CardDefault>
        <CardHeader title={t('title')} />

        <KeyValueListPreview keys={previewKeys} values={previewValues} />
      </CardDefault>
    )
  })

export default SEOUpdateCard

// <Handle
//   name='handle'
//   onInput={handleHandleInput}
//   value={handle}
// />

// <SEOTitle seo={seo} onInput={console.log}>{t('seoTitle')}</SEOTitle>
// <SEODescription seo={seo} onInput={console.log}>{t('seoDescription')}</SEODescription>
// <SEOTranslations seo={seo} onChange={console.log} />
