import { component, detectIsArray } from '@dark-engine/core'

import { useProductCategories } from '../../../data'

const CategoriesListWithData = component(({ categoryIds }) => {
  const { data: categoriesData } = useProductCategories({ ids: categoryIds })

  if (categoriesData) {
    const { categories } = categoriesData
    if (categories.length === 0) {
      return '-'
    }

    const spans = []
    for (let i = 0, len = categories.length; i < len; i++) {
      const productCategory = categories[i]
      const { id, name } = productCategory
      spans.push(<span key={id}>{name}</span>)
    }
    return spans
  }
})

const CategoriesList = component(({ categoryIds }) => {
  if (!categoryIds || (detectIsArray(categoryIds) && categoryIds.length === 0)) {
    return '-'
  }

  return <CategoriesListWithData categoryIds={categoryIds} />
})

export default CategoriesList
