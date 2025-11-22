import { component, useMemo } from '@dark-engine/core'

import { useStockLocations } from '../../../data'
import I32 from '../../input/I32'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import { useTranslation } from '@wareme/translations'

const InventoryLevelInput = component(
  ({
    inventoryItemId,
    label,
    stocked,
    reserved,
    stockLocationId,
    onChange,
    disabled
  }) => {
    const handleBlur = (e) => {
      const { value } = e.target // value is string, needs conversion
      const newStocked = Number(value) + reserved
      onChange(inventoryItemId, stockLocationId, newStocked)
    }

    return (
      <I32 value={stocked - reserved} onBlur={handleBlur} disabled={disabled}>
        {label}
      </I32>
    )
  }
)

const InventoryLevels = component(({ inventoryItem, onChange, disabled }) => {
  const { t } = useTranslation('variants.inventoryLevels')
  const { id, inventoryLevels } = inventoryItem
  const { data: stockLocationsData } = useStockLocations()

  const inventoryLevelsMap = useMemo(() => {
    if (!inventoryLevels) {
      return {}
    }

    const res = {}
    for (let i = 0, len = inventoryLevels.length; i < len; i++) {
      const inventoryLevel = inventoryLevels[i]
      const { stockLocationId } = inventoryLevel
      res[stockLocationId] = inventoryLevel
    }
    return res
  }, [stockLocationsData])

  if (stockLocationsData) {
    const { stockLocations } = stockLocationsData
    const inputs = []
    for (let i = 0, len = stockLocations.length; i < len; i++) {
      const stockLocation = stockLocations[i]

      let stocked = 0
      let reserved = 0
      const inventoryLevel = inventoryLevelsMap[stockLocation.id]
      if (inventoryLevel) {
        const { stockedQuantity, reservedQuantity } = inventoryLevel
        stocked = stockedQuantity
        reserved = reservedQuantity
      }

      inputs.push(
        <InventoryLevelInput
          key={stockLocation.id}
          inventoryItemId={id}
          stockLocationId={stockLocation.id}
          label={stockLocation.name}
          stocked={stocked}
          reserved={reserved}
          onChange={onChange}
          disabled={disabled}
        />
      )
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')} />
        {inputs}
      </CardDefault>
    )
  }
})

export default InventoryLevels
