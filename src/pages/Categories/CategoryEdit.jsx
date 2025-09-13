import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductCategoryUpdateMutation, useProducts, useProductUpdateMutation } from '../../data'
import Card from '../../components/Card'
import ModalFull from '../../components/Modals/ModalFull'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import CategoryInputs from './CategoryInputs'

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
  const { t } = useTranslation('categories.categoryEdit.categoryProducts')
  const fetchAmount = 15
  const { data: productsData } = useProducts({ category_ids: categoryId, fetch: fetchAmount })
  if (productsData) {
    const { products } = productsData
    if (products.length === 0) {
      return null
    }

    const rows = []
    for (let i = 0, len = products.length; i < len; i++) {
      const product = products[i]
      rows.push(<CategoryProduct product={product} categoryId={categoryId} />)
    }

    return (
      <Card>
        <Card.Header title={t('title')} />
        <ul>
          {rows}
        </ul>
      </Card>
    )
  }
})

const CategoryEdit = component(({ productCategory }) => {
  const { id, name } = productCategory
  const { t } = useTranslation('categories.categoryEdit')
  const [updateCategory] = useProductCategoryUpdateMutation(id)
  const [requestData, setRequestData] = useState({})

  const modalRef = useRef(null)

  const formId = 'edit-category-form'
  const formRef = useRef(null)

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

  const handleUpdate = (e) => {
    e.preventDefault()
    updateCategory(requestData)
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <ModalFull title={name} handleClose={handleCloseModal} ref={modalRef}>
        <ModalFull.Body>

          <Card>
            <Card.Header title={t('general')} />

            <CategoryInputs
              formId={formId}
              formRef={formRef}
              categoryData={productCategory}
              onChange={setRequestData}
              onSubmit={handleUpdate}
            />
          </Card>

          <CategoryProducts categoryId={id} />
        </ModalFull.Body>

        <ModalFull.Footer>
          <PrimaryButton type='submit' form={formId}>
            {t('save')}
          </PrimaryButton>
        </ModalFull.Footer>
      </ModalFull>
    </>
  )
})

export default CategoryEdit
