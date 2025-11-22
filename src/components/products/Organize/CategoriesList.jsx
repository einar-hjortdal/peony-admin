import { component, detectIsArray, useMemo } from '@dark-engine/core'

import { useProductCategories } from '../../../data'

const CategoriesListWithData = component(({ categoryIds }) => {
  const { data: productCategoriesData } = useProductCategories()
  const productCategoriesMap = useMemo(() => {
    const res = {}
    if (productCategoriesData) {
      const { categories } = productCategoriesData
      for (let i = 0, len = categories.length; i < len; i++) {
        const productCategory = categories[i]
        const { id } = productCategory
        res[id] = productCategory
      }
    }
    return res
  }, [productCategoriesData])

  if (productCategoriesData) {
    const { categories } = productCategoriesData
    if (categories.length === 0) {
      return '-'
    }

    const spans = []
    for (let i = 0, len = categoryIds.length; i < len; i++) {
      const id = categoryIds[i]
      const productCategory = productCategoriesMap[id]
      const { name } = productCategory
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
