import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductCategoryUpdateMutation, useProducts, useProductUpdateMutation } from '../../data'
import Card from '../../components/Card'
import ModalFull from '../../components/Modals/ModalFull'
import ModalHeader from '../../components/Modals/ModalHeader'
import ModalBody from '../../components/Modals/ModalBody'
import ModalFooter from '../../components/Modals/ModalFooter'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import CategoryInputs from './CategoryInputs'
import MetadataInputs from '../../components/MetadataInputs'

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
  const { id, name } = productCategory // TODO set metadata in requestData
  const { t } = useTranslation('categories.categoryEdit')
  const [updateCategory] = useProductCategoryUpdateMutation(id)
  const [requestData, setRequestData] = useState({})
  // TODO re-render when refetch

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

  const handleMetadataUpdate = (newMetadata) => {
    setRequestData((prevState) => {
      return {
        ...prevState,
        metadata: newMetadata
      }
    })
  }

  const { metadata } = requestData

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <ModalFull ref={modalRef}>
        <ModalHeader title={name} handleClose={handleCloseModal} />
        <ModalBody>

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

          <Card>
            <Card.Header title={t('metadata')} />
            <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
          </Card>

          <CategoryProducts categoryId={id} />
        </ModalBody>

        <ModalFooter>
          <PrimaryButton type='submit' form={formId}>
            {t('save')}
          </PrimaryButton>
        </ModalFooter>
      </ModalFull>
    </>
  )
})

export default CategoryEdit
