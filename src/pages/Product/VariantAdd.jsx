import {
  component,
  detectIsNull,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useCreateVariantMutation } from '../../data'
import VariantInputs from './VariantInputs'

const VariantAdd = component(({ productId }) => {
  const { t } = useTranslation('product.variantAdd')
  const [variantData, setVariantData] = useState({})
  const [createVariant, {
    data: createVariantData,
    isFetching: createVariantIsFetching,
    error: createVariantError
  }] = useCreateVariantMutation(productId)

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

  return (
    <>
      <button type='button' onClick={handleOpenModal}>add variant</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <VariantInputs variantData={variantData} setVariantData={setVariantData} />
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
