import {
  component,
  detectIsNull,
  detectIsUndefined,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useVariantCreateMutation } from '../../../data'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import MetadataInputs from '../../../components/MetadataInputs'
import ModalDefault from '../../../components/Modals/ModalDefault'
import ModalHeader from '../../../components/Modals/ModalHeader'
import ModalBody from '../../../components/Modals/ModalBody'
import ModalFooter from '../../../components/Modals/ModalFooter'
import CardDefault from '../../../components/Cards/CardDefault'
import CardHeader from '../../../components/Cards/CardHeader'
import VariantInputs from './VariantInputs'

const VariantAdd = component(({ productId }) => {
  const { t } = useTranslation('product.variantAdd')
  const [variantData, setVariantData] = useState({})
  const [createVariant, {
    data: createVariantData,
    isFetching: createVariantIsFetching,
    error: createVariantError
  }] = useVariantCreateMutation(productId)

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

  const handleCreate = async () => {
    await createVariant(variantData)
    // TODO handle error if error, close if success
    handleCloseModal()
  }

  const handleMetadataUpdate = (newMetadata) => {
    setVariantData((prevState) => {
      return {
        ...prevState,
        metadata: newMetadata
      }
    })
  }

  const { metadata } = variantData

  return (
    <>
      <PrimaryButton type='button' onClick={handleOpenModal}>{t('add')}</PrimaryButton>
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />

        <ModalBody>
          <VariantInputs
            productId={productId}
            variantData={variantData}
            setVariantData={setVariantData}
          />

          <CardDefault>
            <CardHeader title={t('metadata')} />
            <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
          </CardDefault>
        </ModalBody>

        <ModalFooter>
          <div>
            <button
              type='button'
              onClick={handleCreate}
              disabled={createVariantIsFetching}
            >{t('create')}
            </button>
          </div>
        </ModalFooter>
      </ModalDefault>
    </>
  )
})

export default VariantAdd
