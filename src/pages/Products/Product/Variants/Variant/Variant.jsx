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

          {/* TODO optionValueIds */}

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
            productId={productId}
            variantId={variant.id}
            inventoryItem={variant.inventoryItem}
          />

          <InventoryManagement
            productId={productId}
            variantId={variant.id}
            inventoryItem={variant.inventoryItem}
          />
        </ColumnSmall>
      </>
    )
  }
})

export default Variant
