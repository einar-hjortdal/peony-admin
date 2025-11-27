import { component, detectIsUndefined, useEffect, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from './cards/CardDefault'
import CardHeader from './cards/CardHeader'
import Handle from './input/Handle'
import { useStore } from '../data'
import Textarea from './input/Textarea'
import Text from './input/Text'

const SEOTranslations = component(({ seoTranslations, onChange }) => {
  const { data: storeData } = useStore()
  if (storeData) {
    if (storeData) {
      const { locales } = storeData.store
      if (locales.length === 1) {
        return null
      }
    }

    return (
      <>
        {/*  TODO */}
      </>
    )
  }
})

const SEOTranslationDefault = component(({ seoTranslations, onChange }) => {
  const { t } = useTranslation('seoCard')
  const { data: storeData } = useStore()

  useEffect(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      if (detectIsUndefined(seoTranslations)) {
        onChange([{ localeId: defaultLocaleId }])
      }
    }
  }, [seoTranslations, storeData])

  const seoTranslationData = useMemo(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      if (detectIsUndefined(seoTranslations)) {
        return
      }

      for (let i = 0, len = seoTranslations.length; i < len; i++) {
        if (seoTranslations[i].localeId === defaultLocaleId) {
          return seoTranslations[i]
        }
      }
    }
  }, [seoTranslations, storeData])

  const handleInput = (e) => {
    const { name, value } = e.target
    const { localeId } = seoTranslationData

    const newTranslationData = { ...seoTranslationData, [name]: value }
    const newTranslations = []

    for (let i = 0, len = seoTranslations.length; i < len; i++) {
      if (seoTranslations[i].localeId === localeId) {
        newTranslations.push(newTranslationData)
      } else {
        newTranslations.push(seoTranslations[i])
      }
    }

    onChange(newTranslations)
  }

  if (storeData && seoTranslationData) {
    const { title, description } = seoTranslationData

    return (
      <>
        <Text
          name='title'
          onInput={handleInput}
          value={title}
        >{t('seoTitle')}
        </Text>

        <Textarea
          name='description'
          onInput={handleInput}
          value={description}
        >{t('seoDescription')}
        </Textarea>
      </>
    )
  }
})

const SEOCard = component(({ handle, seoTranslations, onChange }) => {
  const { t } = useTranslation('seoCard')

  const handleHandleInput = (newHandle) => {
    onChange({ handle: newHandle })
  }

  const handleSEOChange = (newSEOTranslations) => {
    onChange({ seoTranslations: newSEOTranslations })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Handle
        name='handle'
        onInput={handleHandleInput}
        value={handle}
      />

      <SEOTranslationDefault seoTranslations={seoTranslations} onChange={handleSEOChange} />
      <SEOTranslations seoTranslations={seoTranslations} onChange={handleSEOChange} />
    </CardDefault>
  )
})

export default SEOCard
