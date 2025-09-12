import { component, detectIsNull, detectIsUndefined, keys, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { useTranslation } from '@wareme/translations'
import ModalFull from '../../components/Modals/ModalFull'
import { useProductCategoryCreateMutation } from '../../data'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import CategoryInputs from './CategoryInputs'
import Card from '../../components/Card'

const NewCategory = component(({ modalRef }) => {
  const { t } = useTranslation('categories.newCategory')
  const formId = 'new-category-form'
  const formRef = useRef(null)

  const [requestData, setRequestData] = useState({})
  const [createCategory] = useProductCategoryCreateMutation()

  const handleCloseModal = () => {
    if (detectIsNull(modalRef) || detectIsNull(modalRef.current)) {
      return
    }

    formRef.current.reset()
    // TODO clear state
    modalRef.current.close()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createCategory(requestData)
  }

  return (
    <ModalFull ref={modalRef} title={t('title')} handleClose={handleCloseModal}>
      <ModalFull.Body>
        <Card>
          <Card.Header title={t('general')} />
          <CategoryInputs
            formId={formId}
            formRef={formRef}
            onChange={setRequestData}
            onSubmit={handleSubmit}
          />
        </Card>
      </ModalFull.Body>

      <ModalFull.Footer>
        <PrimaryButton type='submit' form={formId}>
          {t('save')}
        </PrimaryButton>
      </ModalFull.Footer>
    </ModalFull>
  )
})

export default NewCategory
