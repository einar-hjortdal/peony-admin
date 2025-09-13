import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import {
  useProductCategories,
  useProductCategoryById,
  useProductUpdateMutation
} from '../../data'
import Card from '../../components/Card'
import ButtonMore from '../../components/Buttons/ButtonMore'

const ProductCategoriesList = component(({ productCategories }) => {
  if (productCategories.length === 0) {
    return 'This product is not in any category'
  }

  const spans = []
  for (let i = 0, len = productCategories.length; i < len; i++) {
    const productCategory = productCategories[i]
    const { id, name } = productCategory
    spans.push(<span key={id}>{name}</span>)
  }
  return spans
})

// TODO: to add/remove categories
// first build an array of existing product_category id
// keep it up to date with user input: remove/add ids to the array
// on submit send it to /admin/product/:product_id post with payload {category_ids: [...]}
const CategoriesModal = component(({ productId, productCategories }) => {
  const [categoryIds, setCategoryIds] = useState([])

  useEffect(() => {
    const ids = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const productCategory = productCategories[i]
      const { id } = productCategory
      ids.push(id)
    }
    setCategoryIds(ids)
  }, [productCategories])

  const [updateProduct] = useProductUpdateMutation(productId)

  return null
})

const Categories = component(() => {
  const { t } = useTranslation('product.categories')
  const params = useParams()
  const productId = params.get('id')
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    return (
      <Card>
        <Card.Header title={t('title')}>
          <ButtonMore type='button'>
            actions
          </ButtonMore>
        </Card.Header>
        <div>
          <ProductCategoriesList productCategories={productCategories} />
        </div>
      </Card>
    )
  }
})

export default Categories
