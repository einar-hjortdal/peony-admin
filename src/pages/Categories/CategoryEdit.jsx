import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductCategoryUpdateMutation, useProducts, useProductUpdateMutation } from '../../data'
import ModalFull from '../../components/modals/ModalFull'
import ModalHeader from '../../components/modals/ModalHeader'
import ModalBody from '../../components/modals/ModalBody'
import ModalFooter from '../../components/modals/ModalFooter'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import CategoryInputs from './CategoryInputs'
import MetadataInputs from '../../components/MetadataInputs'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'

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
      <CardDefault>
        <CardHeader title={t('title')} />
        <ul>
          {rows}
        </ul>
      </CardDefault>
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

          <CardDefault>
            <CardHeader title={t('general')} />

            <CategoryInputs
              formId={formId}
              formRef={formRef}
              categoryData={productCategory}
              onChange={setRequestData}
              onSubmit={handleUpdate}
            />
          </CardDefault>

          <CardDefault>
            <CardHeader title={t('metadata')} />
            <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
          </CardDefault>

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
