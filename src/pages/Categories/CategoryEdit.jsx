import { component, detectIsNull, useRef } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductCategoryById, useProductCategoryUpdateMutation } from '../../data'

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
      </dialog>
    </>
  )
})

export default CategoryEdit
