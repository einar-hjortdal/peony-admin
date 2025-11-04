import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useInventoryItemUpdateMutation } from '../../../data'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import Checkbox from '../../input/Checkbox'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'

const InventoryManagement = component(({ productId, variantId, inventoryItem }) => {
  const { id } = inventoryItem
  const { t } = useTranslation('variants.inventoryManagement')
  const [inventoryItemData, setInventoryItemData] = useState(inventoryItem)
  useEffect(() => {
    setInventoryItemData(inventoryItem)
  }, [inventoryItem])

  const [
    updateInventoryItem,
    {
      isFetching: updateInventoryItemIsFethcing
    }
  ] = useInventoryItemUpdateMutation(productId, variantId, id)

  const handleInput = (e) => {
    const { name, value, checked, type } = e.target
    setInventoryItemData((prevState) => {
      if (type === 'checkbox') {
        return { ...prevState, [name]: checked }
      }

      return { ...prevState, [name]: value }
    })
  }

  const handleSave = () => {
    // TODO only subit changes and only submit relevant properties
    updateInventoryItem(inventoryItemData)
  }

  const { sku, manageInventory, allowBackorder } = inventoryItemData

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Text
        maxLength={63}
        name='sku'
        onInput={handleInput}
        value={sku}
      >{t('sku')}
      </Text>

      <Checkbox
        name='manageInventory'
        onChange={handleInput}
        checked={manageInventory}
      >{t('manageInventory')}
      </Checkbox>

      <Checkbox
        name='allowBackorder'
        onChange={handleInput}
        checked={allowBackorder}
      >{t('allowBackorder')}
      </Checkbox>

      <div>
        <PrimaryButton
          type='button'
          onClick={handleSave}
          disabled={updateInventoryItemIsFethcing}
        >{t('save')}
        </PrimaryButton>
      </div>
    </CardDefault>
  )
})

export default InventoryManagement
