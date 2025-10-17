import { component, detectIsNull, useEffect, useMemo, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useProductUpdateMutation } from '../../../../data'
import ModalDefault from '../../../../components/modals/ModalDefault'

const CategoriesSet = component(({ categoryIds, onChange }) => {
  const {
    data: productCategoriesData,
    isFetching: productCategoriesIsFetching
  } = useProductCategories()

  const productCategoriesMap = useMemo(() => {
    if (productCategoriesData) {
      const { productCategories } = productCategoriesData
      const result = {}
      for (let i = 0, len = productCategories.length; i < len; i++) {
        const category = productCategories[i]
        const { id, name } = category
        result[id] = name
      }
      return result
    }
  }, [productCategoriesData])

  const handleRemove = (e) => {
    const { categoryId } = e.target.dataset
    const newCategoryIds = []
    for (let i = 0, len = categoryIds.length; i < len; i++) {
      const id = categoryIds[i]
      if (id !== categoryId) {
        categoryIds.push(id)
      }
      onChange(newCategoryIds)
    }
  }

  if (productCategoriesData) {
    const categoriesSet = []
    for (let i = 0, len = categoryIds.length; i < len; i++) {
      const categoryId = categoryIds[i]
      const categoryName = productCategoriesMap[categoryId]

      categoriesSet.push(
        <div key={categoryId}>
          <span>{categoryName}</span>
          <button
            type='button'
            data-category-id={categoryId}
            onClick={handleRemove}
            disabled={productCategoriesIsFetching}
          >remove {/* TODO use t */}
          </button>
        </div>
      )
    }
    return categoriesSet
  }
})

// TODO add input to filter categories
const CategoriesAdd = component(({ productId, categoryIds, onChange }) => {
  const {
    data: allProductCategoriesData,
    isFetching: allProductCategoriesIsFetching
  } = useProductCategories()

  const {
    data: productCategoriesData,
    isFetching: productCategoriesIsFetching
  } = useProductCategories({ product_ids: productId })

  useEffect(() => {
    const { productCategories } = productCategoriesData
    const newCategoryIds = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const productCategory = productCategories[i]
      const { id } = productCategory
      newCategoryIds.push(id)
    }
    onChange(newCategoryIds)
  }, [productCategoriesData])

  const isDisabled = () => {
    return allProductCategoriesIsFetching || productCategoriesIsFetching
  }

  const handleInput = (e) => {
    const { options } = e.target
    const newCategoryIds = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      if (option.selected && !option.disabled) {
        newCategoryIds.push(option.value)
      }
    }
    onChange(newCategoryIds)
  }

  if (allProductCategoriesData && productCategoriesData) {
    const { productCategories: allProductCategories } = allProductCategoriesData
    const options = []
    for (let i = 0, len = allProductCategories.length; i < len; i++) {
      const category = allProductCategories[i]
      const { id, name } = category

      if (categoryIds.includes(id)) {
        continue
      }

      options.push(
        <option key={id} value={id}>
          {name}
        </option>
      )
    }

    return (
      <select
        multiple
        disabled={isDisabled()}
        value={categoryIds}
        onInput={handleInput}
      >
        {options}
      </select>
    )
  }
})

const CategoriesEdit = component(({ productId }) => {
  const { t } = useTranslation('product.categories.editCategories')

  const [categoryIds, setCategoryIds] = useState([])
  const [
    updateProduct,
    { isFetching: updateProductIsFetching }
  ] = useProductUpdateMutation(productId)

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

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <ModalDefault ref={modalRef}>
        <CategoriesAdd
          productId={productId}
          categoryIds={categoryIds}
          onChange={setCategoryIds}
        />
        <CategoriesSet
          categoryIds={categoryIds}
          onChange={setCategoryIds}
        />
      </ModalDefault>
    </>
  )
})

export default CategoriesEdit
