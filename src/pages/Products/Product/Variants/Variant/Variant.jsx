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
import OptionValues from '../../../../../components/products/Variants/OptionValues'
import Properties from '../../../../../components/products/Variants/Properties'

// TODO card for images
// TODO card for optionValueIds
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
      isFetching: updateVariantIsFetching
    }
  ] = useProductVariantUpdateMutation(productId, variantId)

  const { t } = useTranslation('variant')

  const handleIdentificationChange = (data) => {
    // TODO make modal and encapsulate logic
  }

  const handleOptionValueIdsChange = () => {
    // TODO updateVariant({ optionValueIds: newOptionValueIds })
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

          {/* <Images /> */}

          <OptionValues
            productId={productId}
            variantData={variantData}
            onChange={handleOptionValueIdsChange}
          />

          <Properties
            productId={productId}
            variantId={variant.id}
            inventoryItem={variant.inventoryItem}
          />

          <MetadataCard
            metadata={variant.metadata}
            onChange={handleMetadataChange}
            disabled={updateVariantIsFetching}
          />
        </ColumnLarge>

        <ColumnSmall>
          {/* <InventoryManagement /> */}
          {/* <InventoryDetails /> */}
        </ColumnSmall>
      </>
    )
  }
})

export default Variant
