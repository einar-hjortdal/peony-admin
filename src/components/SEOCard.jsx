import { component, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from './cards/CardDefault'
import CardHeader from './cards/CardHeader'
import Handle from './input/Handle'
import { useStore } from '../data'
import Textarea from './input/Textarea'
import Text from './input/Text'

const SEOTranslation = component(({ localeId, seoTranslations, onChange }) => {
  const { t } = useTranslation('seoCard')

  const seoTranslationData = useMemo(() => {
    if (detectIsUndefined(seoTranslations)) {
      return { localeId }
    }

    for (let i = 0, len = seoTranslations.length; i < len; i++) {
      if (seoTranslations[i].localeId === localeId) {
        return seoTranslations[i]
      }
    }
  }, [seoTranslations])

  const handleInput = (e) => {
    const { name, value } = e.target
    const newSeoTranslationData = { ...seoTranslationData, [name]: value }
    const newSeoTranslations = [newSeoTranslationData]

    if (seoTranslations) {
      for (let i = 0, len = seoTranslations.length; i < len; i++) {
        if (seoTranslations[i].localeId !== seoTranslationData.localeId) {
          newSeoTranslations.push(seoTranslations[i])
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

      <Textarea
        name='description'
        onInput={handleInput}
        value={description}
      >{t('seoDescription')}
      </Textarea>
    </>
  )
})

const SEOTranslationDefault = component(({ seoTranslations, onChange }) => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { defaultLocaleId } = storeData.store

    return (
      <SEOTranslation
        localeId={defaultLocaleId}
        seoTranslations={seoTranslations}
        onChange={onChange}
      />
    )
  }
})

const SEOTranslations = component(({ seoTranslations, onChange }) => {
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

      res.push(
        <li key={id}>
          {code}
          {/* TODO format translation name */}
          <SEOTranslation
            seoTranslations={seoTranslations}
            localeId={id}
            onChange={onChange}
          />
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
