import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'

import {
  useInventoryLevelUpdateMutation,
  useProductVariantById,
  useProductVariantUpdateMutation
} from '../../data'
import SetTitle from '../../components/SetTitle'
import Identification from '../../components/products/Variants/Identification'
import MetadataCard from '../../components/MetadataCard'
import ColumnSmall from '../../components/columns/ColumnSmall'
import ColumnLarge from '../../components/columns/ColumnLarge'
// import OptionValues from '../../components/products/Variants/OptionValues'
import Shipping from '../../components/products/Variants/Shipping'
import InventoryManagement from '../../components/products/Variants/InventoryManagement'
import MoneyAmounts from '../../components/products/Variants/MoneyAmounts'
import InventoryLevels from '../../components/products/Variants/InventoryLevels'

// TODO inventoryLevel
// TODO bulk inventoryLevel editing on its own page (?)
// TODO price, original price, unit pricing
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

  const [
    updateInventoryLevel,
    {
      isFethcing: updateInventoryLevelIsFetching
    }
  ] = useInventoryLevelUpdateMutation(productId, variantId)

  const handleInventoryLevelChange = (inventoryItemId, stockLocationId, stockedQuantity) => {
    updateInventoryLevel(inventoryItemId, stockLocationId, { stockedQuantity })
  }

  const handleIdentificationChange = (newIdentificationData) => {
    updateVariant(newIdentificationData)
  }

  const handleOptionValueIdsChange = (newOptionValueIds) => {
    updateVariant({ optionValueIds: newOptionValueIds })
  }

  const handleMoneyAmountsChange = (newMoneyAmounts) => {
    updateVariant({ moneyAmounts: newMoneyAmounts })
  }

  const handleMetadataChange = (newMetadata) => {
    updateVariant({ metadata: newMetadata })
  }

  const handleInventoryItemChange = (newInventoryItemData) => {
    updateVariant({ inventoryItem: newInventoryItemData })
  }

  if (variantData) {
    const { title, optionValues, inventoryItem, moneyAmounts, metadata } = variantData.variant

    return (
      <>
        <SetTitle title={title} />

        <ColumnLarge>
          <Identification
            variantData={variantData}
            onChange={handleIdentificationChange}
            disabled={updateVariantIsFetching}
          />

          {/* <OptionValues
            productId={productId}
            optionValues={optionValues}
            onChange={handleOptionValueIdsChange}
            disabled={updateVariantIsFetching}
          /> */}

          {/* TODO <Images /> */}

          <MoneyAmounts
            moneyAmounts={moneyAmounts}
            onChange={handleMoneyAmountsChange}
            disabled={updateVariantIsFetching}
          />

          <MetadataCard
            metadata={metadata}
            onChange={handleMetadataChange}
            disabled={updateVariantIsFetching}
          />
        </ColumnLarge>

        <ColumnSmall>
          <Shipping
            inventoryItem={inventoryItem}
            onChange={handleInventoryItemChange}
            disabled={updateVariantIsFetching}
          />

          <InventoryManagement
            inventoryItem={inventoryItem}
            onChange={handleInventoryItemChange}
            disabled={updateVariantIsFetching}
          />

          <InventoryLevels
            inventoryItem={inventoryItem}
            onChange={handleInventoryLevelChange}
            disabled={updateInventoryLevelIsFetching}
          />
        </ColumnSmall>
      </>
    )
  }
})

export default Variant
