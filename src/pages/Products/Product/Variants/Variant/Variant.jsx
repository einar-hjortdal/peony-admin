import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductVariantById, useProductVariantUpdateMutation } from '../../../../../data'
import CardDefault from '../../../../../components/cards/CardDefault'
import CardHeader from '../../../../../components/cards/CardHeader'
import SetTitle from '../../../../../components/SetTitle'
import Identification from '../../../../../components/products/Variants/Identification'
import MetadataCard from '../../../../../components/MetadataCard'
import ColumnSmall from '../../../../../components/columns/ColumnSmall'
import ColumnLarge from '../../../../../components/columns/ColumnLarge'

// TODO card for images
// TODO card for optionValueIds
// TODO card for material, weight, length, height, width (partial inventoryItem, properties)
// TODO card for requires_shipping, manage_inventory, allow_backorder (partial inventoryItem, inventory management)
// TODO cards for sku, origin_country, hs_code, mid_code (partial inventoryItem, TODO name)

// moneyAmounts managed elsewhere
// inventoryLevel managed elsewhere
const Variant = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const variantId = params.get('variantId')

  const { data: variantData } = useProductVariantById(productId, variantId)

  const [
    updateVariant,
    {
      isFetching: updateVariantIsFetching,
      error: updateVariantError
    }
  ] = useProductVariantUpdateMutation(productId, variantId)

  const { t } = useTranslation('variant')

  const handleIdentificationChange = (data) => {
    // TODO make modal and encapsulate logic
  }

  const handleMetadataChange = (newMetadata) => {
    updateVariant({ metadata: newMetadata })
  }

  if (variantData) {
    const { variant } = variantData
    return (
      <>
        <SetTitle title={variant.title} />

        <ColumnLarge>
          <CardDefault>
            <CardHeader title={t('general')} />
            <Identification variantData={variant} onChange={handleIdentificationChange} />
          </CardDefault>

          <MetadataCard metadata={variant.metadata} onChange={handleMetadataChange} />
        </ColumnLarge>

        <ColumnSmall>
          {/* TODO */}
        </ColumnSmall>
      </>
    )
  }
})

export default Variant
