import {
  component,
  detectIsNull,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useVariantUpdateMutation } from '../../../data'
import MetadataInputs from '../../../components/MetadataInputs'
import ModalDefault from '../../../components/modals/ModalDefault'
import ModalHeader from '../../../components/modals/ModalHeader'
import ModalFooter from '../../../components/modals/ModalFooter'
import ModalBody from '../../../components/modals/ModalBody'
import CardDefault from '../../../components/cards/CardDefault'
import CardHeader from '../../../components/cards/CardHeader'
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
      originCountry: variant.originCountry,
      optionValues: variant.optionValues,
      metadata: variant.metadata
    })
  }, [variant])

  const [
    updateVariant,
    { isFetching: updateVariantIsFetching, error: updateVariantError }
  ] = useVariantUpdateMutation(productId)

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

  const handleMetadataUpdate = (newMetadata) => {
    setNewVariantData((prevState) => {
      return {
        ...prevState,
        metadata: newMetadata
      }
    })
  }

  const handleUpdate = async () => {
    const { id } = variant
    // TODO only include changes: variantRank and optionValues may be the same
    await updateVariant(id, newVariantData)
    // TODO handle error if error, close if success
    handleCloseModal()
  }

  const { metadata } = newVariantData

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />

        <ModalBody>
          <CardDefault>
            <CardHeader title={t('general')} />
            <VariantInputs
              productId={productId}
              variantData={newVariantData}
              setVariantData={setNewVariantData}
            />
          </CardDefault>

          <CardDefault>
            <CardHeader title={t('metadata')} />
            <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
          </CardDefault>
        </ModalBody>

        <ModalFooter>
          <div>
            <button
              type='button'
              onClick={handleUpdate}
              disabled={updateVariantIsFetching}
            >{t('save')}
            </button>
          </div>
        </ModalFooter>
      </ModalDefault>
    </>
  )
})

export default VariantEdit
