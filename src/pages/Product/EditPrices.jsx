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

const EditPrices = component(() => {
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

  return (
    <>
      <button type='button' onClick={handleOpenModal}>edit prices</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <div>
          bro
        </div>
      </dialog>
    </>
  )
})

export default EditPrices
