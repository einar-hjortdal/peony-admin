import {
  component,
  detectIsNull,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useUpdateVariantMutation } from '../../data'
import VariantInputs from './VariantInputs'

const VariantEdit = component(({ productId, variant }) => {
  const { t } = useTranslation('product.variantEdit')
  const [newVariantData, setNewVariantData] = useState({})

  // get starting state: exclude properties like id and createdAt from variant
  useEffect(() => {
    setNewVariantData({
      title: variant.title,
      sku: variant.sku,
      ean: variant.ean,
      upc: variant.upc,
      barcode: variant.barcode,
      hsCode: variant.hsCode,
      variantRank: variant.variantRank,
      midCode: variant.midCode,
      material: variant.material,
      weight: variant.weight,
      length: variant.length,
      height: variant.height,
      width: variant.width,
      originCountry: variant.originCountry
    })
  }, [variant])

  const [updateVariant, {
    data: updateVariantData,
    isFetching: updateVariantIsFetching,
    error: updateVariantError
  }] = useUpdateVariantMutation(productId)

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

  const handleUpdate = async () => {
    const { id } = variant
    await updateVariant(id, newVariantData)
    // TODO handle error if error, close if success
    handleCloseModal()
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <VariantInputs variantData={newVariantData} setVariantData={setNewVariantData} />
        <div>
          <button
            type='button'
            onClick={handleUpdate}
            disabled={updateVariantIsFetching}
          >{t('save')}
          </button>
        </div>
      </dialog>
    </>
  )
})

export default VariantEdit
