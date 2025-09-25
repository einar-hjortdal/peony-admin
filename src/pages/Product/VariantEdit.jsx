import {
  component,
  detectIsNull,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useVariantUpdateMutation } from '../../data'
import VariantInputs from './VariantInputs'
import Card from '../../components/Card'
import MetadataInputs from '../../components/MetadataInputs'
import ModalDefault from '../../components/Modals/ModalDefault'
import ModalHeader from '../../components/Modals/ModalHeader'
import ModalFooter from '../../components/Modals/ModalFooter'
import ModalBody from '../../components/Modals/ModalBody'

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
          <Card>
            <Card.Header title={t('general')} />
            <VariantInputs
              productId={productId}
              variantData={newVariantData}
              setVariantData={setNewVariantData}
            />
          </Card>

          <Card>
            <Card.Header title={t('metadata')} />
            <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
          </Card>
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
