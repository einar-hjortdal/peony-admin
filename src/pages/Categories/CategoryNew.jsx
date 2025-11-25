import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import ModalDefault from '../../components/modals/ModalDefault'
import ModalHeader from '../../components/modals/ModalHeader'
import ModalBody from '../../components/modals/ModalBody'
import ModalFooter from '../../components/modals/ModalFooter'
import { useProductCategoryCreateMutation } from '../../data'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import CategoryInputs from './CategoryInputs'
import MetadataInputs from '../../components/input/Metadata'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'

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
    <ModalDefault ref={modalRef}>
      <ModalHeader title={t('title')} handleClose={handleCloseModal} />

      <ModalBody>
        <CardDefault>
          <CardHeader title={t('general')} />
          <CategoryInputs
            formId={formId}
            formRef={formRef}
            onChange={setRequestData}
            onSubmit={handleSubmit}
          />
        </CardDefault>

        <CardDefault>
          <CardHeader title={t('metadata')} />
          <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
        </CardDefault>
      </ModalBody>

      <ModalFooter>
        <PrimaryButton type='submit' form={formId}>
          {t('save')}
        </PrimaryButton>
      </ModalFooter>
    </ModalDefault>
  )
})

export default NewCategory
