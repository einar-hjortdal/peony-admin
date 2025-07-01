import { component, detectIsUndefined, useMemo } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById } from '../data'
import Card from '../components/Card'
import { valueOrDefault } from '../translations'

const TranslationGroup = component(({ locale, title, subtitle, description }) => {
  const { t } = useTranslation('product.translationGroup')
  return (
    <div>
      {t('locale')}: {locale}
      <div>
        {t('title')}: {title}
      </div>
      <div>
        {t('subtitle')}: {subtitle}
      </div>
      <div>
        {t('description')}: {description}
      </div>
    </div>
  )
})

const Translations = component(({ productId }) => {
  const { t } = useTranslation('product.translation')
  const { data, isFetching, error } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError } = useStore()
  const { defaultLocaleId, locales } = storeData
  const { translations } = data

  const localeMap = useMemo(() => {
    const res = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const { id, code } = locales[i]
      res[id] = code
    }
    return res
  }, storeData)

  const translationsMap = useMemo(() => {
    const res = {}
    if (detectIsUndefined(translations)) {
      return res
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const { localeId } = translations[i]
      res[localeId] = translations[i]
    }
    return res
  }, data)

  const defaultTranslation = translationsMap[defaultLocaleId]
  const res = []
  res.push(
    <TranslationGroup
      locale={localeMap[defaultLocaleId]}
      title={defaultTranslation.title}
      subtitle={defaultTranslation.subtitle}
      description={defaultTranslation.description}
    />
  )

  for (let i = 0, len = locales.length; i < len; i++) {
    const { id } = locales[i]
    if (defaultLocaleId === id) {
      continue
    }

    const translation = translationsMap[id]
    if (detectIsUndefined(translation)) {
      continue
    }

    res.push(
      <TranslationGroup
        locale={localeMap[id]}
        title={valueOrDefault(translation.title, '-')}
        subtitle={valueOrDefault(translation.subtitle, '-')}
        description={valueOrDefault(translation.description, '-')}
      />
    )
  }

  return res
})

const Product = component(() => {
  const { t, translator } = useTranslation('product')
  const params = useParams()
  const productId = params.get('id')
  const { data, isFetching, error } = useProductById(productId)

  // display data and allow updating
  // display variants as a table (title, sku ean), buttons: add, edit prices, edit variants, edit options
  // display attributes from variant with rank 0
  // check database changes when adding prices
  if (data) {
    return (
      <>
        <Card>
          <div>
            {t('details')}
            <Translations productId={productId} />
            <div>
              {t('type')}
            </div>
            <div>
              {t('collection')}
            </div>
            <div>
              {t('category')}
            </div>
            <div>
              {t('discountable')}
            </div>
            <div>
              {t('salesChannels')}
            </div>
          </div>
          <div>
            {t('translations')}
            <div>
              TODO component
            </div>
          </div>
        </Card>
        <Card>
          <div>
            {t('variants')}
            <div>
              TODO component
            </div>
          </div>
        </Card>
      </>
    )
  }
})

export default Product
