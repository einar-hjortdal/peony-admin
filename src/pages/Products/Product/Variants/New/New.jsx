import {
  component,
  detectIsNull,
  detectIsUndefined,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductVariantCreateMutation } from '../../../../../data'
import PrimaryButton from '../../../../../components/buttons/PrimaryButton'
import MetadataInputs from '../../../../../components/input/Metadata'
import CardDefault from '../../../../../components/cards/CardDefault'
import CardHeader from '../../../../../components/cards/CardHeader'
import VariantInputs from '../../VariantInputs'
import SetTitle from '../../../../../components/SetTitle'

const New = component(() => {
  const { t } = useTranslation('product.variants.new')
  const params = useParams()
  const productId = params.get('productId')
  const [variantData, setVariantData] = useState({})
  const [createVariant, {
    data: createVariantData,
    isFetching: createVariantIsFetching,
    error: createVariantError
  }] = useProductVariantCreateMutation(productId)

  useEffect(() => {
    if (createVariantData) {
      // TODO go back to product page
    }
  }, [createVariantData])

  const handleCreate = async () => {
    createVariant(variantData)
    // TODO handle error if error, close if success
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
      <SetTitle title={t('title')} />
      {t('add')}

      <VariantInputs
        productId={productId}
        variantData={variantData}
        setVariantData={setVariantData}
      />

      <CardDefault>
        <CardHeader title={t('metadata')} />
        <MetadataInputs metadata={metadata} onChange={handleMetadataUpdate} />
      </CardDefault>

      <div>
        <PrimaryButton
          type='button'
          onClick={handleCreate}
          disabled={createVariantIsFetching}
        >{t('create')}
        </PrimaryButton>
      </div>
    </>
  )
})

export default New
