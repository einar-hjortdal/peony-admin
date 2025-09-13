import { component, detectIsUndefined } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById, useProductCategoryById } from '../../data'
import Card from '../../components/Card'
import { formatLine } from '../../utils'
import Variants from './Variants'
import SetTitle from '../../components/SetTitle'
import If from '../../components/If'
import ColumnLarge from '../../components/Columns/ColumnLarge'
import ColumnSmall from '../../components/Columns/ColumnSmall'
import Categories from './Categories'
import SalesChannels from './SalesChannels'
import Options from './Options'
import Images from './Images'

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

const TranslationDefault = component(({ productId }) => {
  const { translationsObject } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId } = storeData.store

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
  return res
})

const Translations = component(({ productId }) => {
  const { translationsObject } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId, locales } = storeData.store

  const res = []
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

const Thumbnail = component(({ productId }) => {
  const { data } = useProductById(productId)

  if (data) {
    const thumbnail = data.thumbnail
    return (
      <div>
        <img src={thumbnail} />
      </div>
    )
  }
})

const Product = component(() => {
  const { t, translator } = useTranslation('product')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  // display data and allow updating
  // display variants as a table (title, sku ean), buttons: add, edit prices, edit variants, edit options
  // display attributes from variant with rank 0
  // check database changes when adding prices

  // TODO show thumbnail marker on image that is also the thumbnail
  if (productData) {
    const { discountable, status } = productData.product
    return (
      <>
        <SetTitle title={t('details')} />
        <ColumnLarge>
          <Card>
            <Card.Header title={t('details')}>
              <If condition={status === 'draft'}>
                <Card.Header.BadgeWarning>{status}</Card.Header.BadgeWarning>
              </If>
              <If condition={status === 'published'}>
                <Card.Header.BadgeSuccess>{status}</Card.Header.BadgeSuccess>
              </If>
            </Card.Header>
            <TranslationDefault productId={productId} />
            {/* <div>
              {t('type')}
            </div> */}
            <div>
              {t('discountable')}: {String(discountable)}
              {/* TODO */}
            </div>
          </Card>

          <Images />
          <Options />
          <Variants />
        </ColumnLarge>

        <ColumnSmall>
          <SalesChannels />
          <Categories />
          {/* TODO tags */}
          {/* TODO collections */}
        </ColumnSmall>
      </>
    )
  }
})

export default Product
