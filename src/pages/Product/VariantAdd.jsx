import {
  component,
  detectIsNull,
  detectIsUndefined,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useVariantCreateMutation } from '../../data'
import VariantInputs from './VariantInputs'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import MetadataInputs from '../../components/MetadataInputs'
import Card from '../../components/Card'

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
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <VariantInputs
          productId={productId}
          variantData={variantData}
          setVariantData={setVariantData}
        />

        <Card>
          <Card.Header title={t('metadata')} />
          <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
        </Card>

        <div>
          <button
            type='button'
            onClick={handleCreate}
            disabled={createVariantIsFetching}
          >{t('create')}
          </button>
        </div>
      </dialog>
    </>
  )
})

export default VariantAdd
