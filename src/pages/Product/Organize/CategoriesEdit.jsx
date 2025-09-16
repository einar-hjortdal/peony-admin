import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useProductUpdateMutation } from '../../../data'

const o = component(({ productId, productCategoriesData }) => {
  const { productCategories } = productCategoriesData
  const { t } = useTranslation('product.categories.editCategories')
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
  const { data: allProductCategoriesData } = useProductCategories()

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.close()
  }

  // const allProductCategories = allProductCategoriesData.productCategories
  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <dialog ref={modalRef}>
        {/* TODO use a select element with one option per category? */}
      </dialog>
    </>
  )
})

// TODO: to add/remove categories
// first build an array of existing product_category id
// keep it up to date with user input: remove/add ids to the array
// on submit send it to /admin/product/:product_id post with payload {category_ids: [...]}
const CategoriesEdit = component(({ productId }) => {
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })

  if (productCategoriesData) {
  }
})

export default CategoriesEdit
