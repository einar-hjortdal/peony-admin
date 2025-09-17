import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductCategories, useProductUpdateMutation } from '../../../data'

const CategoriesSet = component(({ productId }) => {
  const {
    data: productCategoriesData,
    isFetching: productCategoriesIsFetching
  } = useProductCategories({ product_ids: productId })
  const [updateProduct, { isFetching: updateProductIsFetching }] = useProductUpdateMutation(productId)

  const handleRemove = (e) => {
    const { categoryId } = e.target.dataset
    const { productCategories } = productCategoriesData
    const categoryIds = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const category = productCategories[i]
      const { id } = category
      if (id !== categoryId) {
        categoryIds.push(id)
      }
      console.log({ categories: categoryIds }) // TODO remove line and enable update
      // updateProduct({ categories: categoryIds })
    }
  }

  const isDisabled = () => {
    return productCategoriesIsFetching || updateProductIsFetching
  }

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    const categoriesSet = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const category = productCategories[i]
      const { id, name } = category

      categoriesSet.push(
        <div key={id}>
          <span>{name}</span>
          <button
            type='button'
            data-category-id={id}
            onClick={handleRemove}
            disabled={isDisabled()}
          >remove
            {/* TODO use t */}
          </button>
        </div>
      )
    }
    return categoriesSet
  }
})

const CategoriesAdd = component(({ productId }) => {
  const {
    data: allProductCategoriesData,
    isFetching: allProductCategoriesIsFetching
  } = useProductCategories()
  const {
    data: productCategoriesData,
    isFetching: productCategoriesIsFetching
  } = useProductCategories({ product_ids: productId })

  const [
    updateProduct,
    { isFetching: updateProductIsFetching }
  ] = useProductUpdateMutation(productId)

  const [categoryIds, setCategoryIds] = useState([])

  useEffect(() => {
    const { productCategories } = productCategoriesData
    const ids = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const productCategory = productCategories[i]
      const { id } = productCategory
      ids.push(id)
    }
    setCategoryIds(ids)
  }, [productCategoriesData])

  const isDisabled = () => {
    return allProductCategoriesIsFetching || productCategoriesIsFetching || updateProductIsFetching
  }

  const handleInput = (e) => {
    const { options } = e.target
    const picked = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      if (option.selected && !option.disabled) {
        picked.push(option.value)
      }
    }
    setCategoryIds(picked)
    console.log(picked)
    // updateProduct({ category_ids: picked })
  }

  if (allProductCategoriesData && productCategoriesData) {
    const { productCategories: allProductCategories } = allProductCategoriesData
    const options = []
    for (let i = 0, len = allProductCategories.length; i < len; i++) {
      const category = allProductCategories[i]
      const { id, name } = category
      const disabled = categoryIds.includes(id)
      options.push(
        <option key={id} value={id} disabled={disabled}>
          {name}
        </option>
      )
    }

    // TODO can't unselect right now
    // But also, if I can select and unselect, there is no point in having CategoriesSet component
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
      <dialog ref={modalRef}>
        <CategoriesAdd productId={productId} />
        <CategoriesSet productId={productId} />
      </dialog>
    </>
  )
})

export default CategoriesEdit
