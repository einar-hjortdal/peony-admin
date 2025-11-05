import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'

import {
  useProductVariantById,
  useProductVariantUpdateMutation
} from '../../../../../data'
import SetTitle from '../../../../../components/SetTitle'
import Identification from '../../../../../components/products/Variants/Identification'
import MetadataCard from '../../../../../components/MetadataCard'
import ColumnSmall from '../../../../../components/columns/ColumnSmall'
import ColumnLarge from '../../../../../components/columns/ColumnLarge'
import OptionValues from '../../../../../components/products/Variants/OptionValues'
import Shipping from '../../../../../components/products/Variants/Shipping'
import InventoryManagement from '../../../../../components/products/Variants/InventoryManagement'

// TODO moneyAmounts
// TODO inventoryLevel
// TODO bulk moneyAmounts and inventoryLevel editing in their own page
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

  const handleIdentificationChange = (newIdentificationData) => {
    updateVariant(newIdentificationData)
  }

  const handleOptionValueIdsChange = (newOptionValueIds) => {
    updateVariant({ optionValueIds: newOptionValueIds })
  }

  const handleMetadataChange = (newMetadata) => {
    updateVariant({ metadata: newMetadata })
  }

  const handleInventoryItemChange = (data) => {
    updateVariant({ inventoryItem: data })
  }

  if (variantData) {
    const { variant } = variantData
    return (
      <>
        <SetTitle title={variant.title} />

        <ColumnLarge>
          <Identification
            variantData={variantData}
            onChange={handleIdentificationChange}
            disabled={updateVariantIsFetching}
          />

          <OptionValues
            productId={productId}
            variantData={variantData}
            onChange={handleOptionValueIdsChange}
            disabled={updateVariantIsFetching}
          />

          {/* TODO <Images /> */}

          <OptionValues
            productId={productId}
            variantData={variantData}
            onChange={handleOptionValueIdsChange}
          />

          <MetadataCard
            metadata={variant.metadata}
            onChange={handleMetadataChange}
            disabled={updateVariantIsFetching}
          />
        </ColumnLarge>

        <ColumnSmall>
          <Shipping
            inventoryItem={variant.inventoryItem}
            onChange={handleInventoryItemChange}
            disabled={updateVariantIsFetching}
          />

          <InventoryManagement
            inventoryItem={variant.inventoryItem}
            onChange={handleInventoryItemChange}
            disabled={updateVariantIsFetching}
          />
        </ColumnSmall>
      </>
    )
  }
})

export default Variant
