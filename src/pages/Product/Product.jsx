import { component, detectIsUndefined } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById, useProductCategoryById } from '../../data'
import Card from '../../components/Card'
import { formatLine } from '../../utils'
import Variants from './Variants'
import AddImageButton from './AddImageButton'
import CardContainerLarge from '../../components/Containers/CardContainerLarge'
import CardContainerSmall from '../../components/Containers/CardContainerSmall'
import CardContainerFull from '../../components/Containers/CardContainerFull'
import SetTitle from '../../components/SetTitle'
import If from '../../components/If'

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

const Category = component(({ productCategoryId }) => {
  const { data } = useProductCategoryById(productCategoryId)
  return (
    JSON.stringify(data) // TODO
  )
})

const ProductCategory = component(({ productCategoryId }) => {
  if (detectIsUndefined(productCategoryId)) {
    return '-'
  }
  return <Category productCategoryId={productCategoryId} />
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
    const { categoryId, discountable, status } = data.product
    return (
      <>
        <SetTitle title={t('details')} />
        <CardContainerLarge>
          <Card>
            <Card.Header title={t('details')}>
              <If condition={status === 'draft'}>
                <Card.Header.BadgeWarning>{status}</Card.Header.BadgeWarning>
              </If>
              <If condition={status === 'published'}>
                <Card.Header.BadgeSuccess>{status}</Card.Header.BadgeSuccess>
              </If>
            </Card.Header>
            <Card.Body>
              <TranslationDefault productId={productId} />
              {/* <div>
              {t('type')}
            </div>
            <div>
              {t('collection')}
            </div> */}
              <div>
                {t('category')}: <ProductCategory productCategoryId={categoryId} />
              </div>
              <div>
                {t('discountable')}: {String(discountable)}
                {/* TODO */}
              </div>
              <div>
                {t('salesChannels')}
                {/* TODO */}
              </div>
            </Card.Body>
          </Card>
        </CardContainerLarge>

        <CardContainerSmall>
          <Card>
            <Card.Header title={t('translations')} />
            <Translations productId={productId} />
          </Card>
        </CardContainerSmall>

        <CardContainerLarge>
          <Card>
            <Card.Header title={t('images')}>
              <AddImageButton productId={productId} />
            </Card.Header>
            <Card.Body>
              {/* show images  */}
            </Card.Body>
          </Card>
        </CardContainerLarge>

        <CardContainerSmall>
          <Card>
            <Card.Header title={t('thumbnail')} />
            <Thumbnail productId={productId} />
          </Card>
        </CardContainerSmall>

        <CardContainerFull>
          <Variants productId={productId} />
        </CardContainerFull>
      </>
    )
  }
})

export default Product
