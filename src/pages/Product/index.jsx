import { component, detectIsUndefined } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById } from '../../data'
import Card from '../../components/Card'
import { formatLine } from './utils'
import Variants from './Variants'

const TranslationGroup = component(({ locale, title, subtitle, description }) => {
  const { t, translator } = useTranslation('product.translationGroup')

  return (
    <div>
      {t('locale')}: {locale} <span>{translator.formatName(locale, { type: 'language' })}</span>
      <div>
        {t('title')}: {formatLine(title)}
      </div>
      <div>
        {t('subtitle')}: {formatLine(subtitle)}
      </div>
      <div>
        {t('description')}: {formatLine(description)}
      </div>
    </div>
  )
})

const Translations = component(({ productId }) => {
  const { t } = useTranslation('product.translation')
  const { data, translationsObject } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId, locales } = storeData

  const defaultTranslation = translationsObject[defaultLocaleId]
  const res = []
  res.push(
    <TranslationGroup
      locale={localesObject[defaultLocaleId]}
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

    const translation = translationsObject[id]
    if (detectIsUndefined(translation)) {
      continue
    }

    res.push(
      <TranslationGroup
        locale={localesObject[id]}
        title={translation.title}
        subtitle={translation.subtitle}
        description={translation.description}
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
            {/* <div>
              {t('type')}
            </div>
            <div>
              {t('collection')}
            </div>
            <div>
              {t('category')}
            </div> */}
            <div>
              {t('discountable')}: {String(data.discountable)}
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
        <Variants productId={productId} />
      </>
    )
  }
})

export default Product
