import { component, useEffect, useState } from '@dark-engine/core'
import { useHistory, useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductVariantCreateMutation } from '../../data'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import SetTitle from '../../components/SetTitle'
import ColumnLarge from '../../components/columns/ColumnLarge'
import ColumnSmall from '../../components/columns/ColumnSmall'
import MetadataCard from '../../components/MetadataCard'
import Identification from '../../components/products/Variants/Identification'
import MoneyAmounts from '../../components/products/Variants/MoneyAmounts'
import OptionValues from '../../components/products/Variants/OptionValues'
import Shipping from '../../components/products/Variants/Shipping'
import InventoryManagement from '../../components/products/Variants/InventoryManagement'
import InventoryLevels from '../../components/products/Variants/InventoryLevels'

const NewVariant = component(() => {
  const { t } = useTranslation('product.variants.new')
  const params = useParams()
  const productId = params.get('productId')
  const [variantData, setVariantData] = useState({})
  const [createVariant, {
    data: createVariantData,
    isFetching: createVariantIsFetching
  }] = useProductVariantCreateMutation(productId)

  const history = useHistory()
  useEffect(() => {
    if (createVariantData) {
      history.push(`/products/${productId}`)
    }
  }, [createVariantData])

  const handleCreate = async () => {
    createVariant(variantData)
    // TODO handle error if error
  }

  const handleIdentificationChange = (newIdentificationData) => {
    setVariantData((prevState) => {
      return { ...prevState, ...newIdentificationData }
    })
  }

  const handleOptionValueIdsChange = (newOptionValueIds) => {
    setVariantData((prevState) => {
      return { ...prevState, optionValueIds: newOptionValueIds }
    })
  }

  const handleMoneyAmountsChange = (newMoneyAmounts) => {
    setVariantData((prevState) => {
      return { ...prevState, moneyAmounts: newMoneyAmounts }
    })
  }

  const handleMetadataUpdate = (newMetadata) => {
    setVariantData((prevState) => {
      return { ...prevState, metadata: newMetadata }
    })
  }

  const handleInventoryItemChange = (newInventoryItemData) => {
    setVariantData((prevState) => {
      const { inventoryItem } = prevState
      if (inventoryItem) {
        const newInventoryItem = { ...inventoryItem, ...newInventoryItemData }
        return { ...prevState, inventoryItem: newInventoryItem }
      }
      return { ...prevState, inventoryItem: newInventoryItemData }
    })
  }

  // TODO implement in peony
  const handleInventoryLevelChange = (inventoryItemId, stockLocationId, stockedQuantity) => {
    setVariantData((prevState) => {
      const { inventoryItem } = prevState
      const newInventoryLevel = { stockLocationId, stockedQuantity }
      if (!inventoryItem) {
        const newInventoryLevels = [newInventoryLevel]
        const newInventoryItem = { inventoryLevels: newInventoryLevels }
        return { ...prevState, inventoryItem: newInventoryItem }
      }

      const { inventoryLevels } = inventoryItem
      if (!inventoryLevels) {
        const newInventoryLevels = [newInventoryLevel]
        const newInventoryItem = { ...inventoryItem, inventoryLevels: newInventoryLevels }
        return { ...prevState, inventoryItem: newInventoryItem }
      }

      const newInventoryLevels = [...inventoryLevels]
      for (let i = 0, len = inventoryLevels.length; i < len; i++) {
        const inventoryLevel = inventoryLevels[i]
        if (inventoryLevel.stockLocationId === stockLocationId) {
          newInventoryLevels[i] = newInventoryLevel
          const newInventoryItem = { ...inventoryItem, inventoryLevels: newInventoryLevels }
          return { ...prevState, inventoryItem: newInventoryItem }
        }
      }

      newInventoryLevels.push(newInventoryLevel)
      const newInventoryItem = { ...inventoryItem, inventoryLevels: newInventoryLevels }
      return { ...prevState, inventoryItem: newInventoryItem }
    })
  }

  const { optionValues, moneyAmounts, inventoryItem, metadata } = variantData

  return (
    <>
      <SetTitle title={t('title')} />
      {t('add')}

      <ColumnLarge>
        <Identification
          variantData={variantData}
          onChange={handleIdentificationChange}
          disabled={createVariantIsFetching}
        />

        <OptionValues
          productId={productId}
          optionValues={optionValues}
          onChange={handleOptionValueIdsChange}
          disabled={createVariantIsFetching}
        />

        {/* TODO <Images /> */}

        <MoneyAmounts
          moneyAmounts={moneyAmounts}
          onChange={handleMoneyAmountsChange}
          disabled={createVariantIsFetching}
        />

        <MetadataCard
          metadata={metadata}
          onChange={handleMetadataUpdate}
          disabled={createVariantIsFetching}
        />
      </ColumnLarge>

      <ColumnSmall>
        <Shipping
          inventoryItem={inventoryItem}
          onChange={handleInventoryItemChange}
          disabled={createVariantIsFetching}
        />

        <InventoryManagement
          inventoryItem={inventoryItem}
          onChange={handleInventoryItemChange}
          disabled={createVariantIsFetching}
        />

        <InventoryLevels
          inventoryItem={inventoryItem}
          onChange={handleInventoryLevelChange}
          disabled={createVariantIsFetching}
        />
      </ColumnSmall>

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

export default NewVariant
