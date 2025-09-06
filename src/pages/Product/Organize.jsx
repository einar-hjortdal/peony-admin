import { component, detectIsUndefined } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductCategoryById } from '../../data'
import Card from '../../components/Card'

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

// TODO category, type, tags, collections + changes
const Organize = component(() => {
  const { t } = useTranslation('product.organize')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  if (productData) {
    const { categoryId } = productData.product
    return (
      <Card>
        <Card.Header title={t('title')} />
        <div>
          {t('category')}: <ProductCategory productCategoryId={categoryId} />
        </div>
      </Card>
    )
  }

  return null
})

export default Organize
