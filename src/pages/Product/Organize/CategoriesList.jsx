import { component } from '@dark-engine/core'

import { useProductCategories } from '../../../data'

const CategoriesList = component(({ productId }) => {
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
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
  }
})

export default CategoriesList
