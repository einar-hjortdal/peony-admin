import { component, detectIsNull, useRef } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductCategoryUpdateMutation, useProducts, useProductUpdateMutation } from '../../data'

const CategoryProduct = component(({ product, categoryId }) => {
  const { id: productId } = product
  const [updateProduct] = useProductUpdateMutation(productId)
  // TODO allow romoving product from category
  return (
    <li>
      {/* TODO */}
    </li>
  )
})

const CategoryProducts = component(({ categoryId }) => {
  const fetchAmount = 15
  const { data: productsData } = useProducts({ category_ids: categoryId, fetch: fetchAmount })
  if (productsData) {
    // TODO list products in category
    const { products } = productsData

    const rows = []
    for (let i = 0, len = products.length; i < len; i++) {
      const product = products[i]
      rows.push(<CategoryProduct product={product} categoryId={categoryId} />)
    }

    return (
      <ul>
        {rows}
      </ul>
    )
  }
})

const CategoryEdit = component(({ productCategory }) => {
  const { id } = productCategory
  const [updateCategory] = useProductCategoryUpdateMutation(id)
  const { t } = useTranslation('categories.categoryEdit')

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

  const handleUpdate = () => {
    updateCategory(data)
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <dialog ref={modalRef}>
        {/* <CategoryInputs /> */}
        {/* TODO */}
        <CategoryProducts categoryId={id} />
      </dialog>
    </>
  )
})

export default CategoryEdit
