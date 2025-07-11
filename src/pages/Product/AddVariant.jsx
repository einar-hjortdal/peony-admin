import {
  component,
  detectIsArray,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsString,
  detectIsUndefined,
  keys,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import {
  useStore,
  useProductById,
  useUpdateProductMutation,
  useCreateVariantMutation
} from '../../data'
import Card from '../../components/Card'
import If from '../../components/If'
import { formatLine } from './utils'

const AddVariant = component(({ productId }) => {
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

  const handleCreate = () => {
    createVariant(variantData)
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>add variant</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <form>
          <button
            type='button'
            onClick={handleCreate}
            disabled={createVariantIsFetching}
          >create
          </button>
        </form>
      </dialog>
    </>
  )
})

export default AddVariant