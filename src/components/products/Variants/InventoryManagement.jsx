import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import Checkbox from '../../input/Checkbox'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'

const InventoryManagement = component(({ inventoryItem, onChange, disabled }) => {
  const { t } = useTranslation('variants.inventoryManagement')
  const [inventoryItemData, setInventoryItemData] = useState(inventoryItem)
  useEffect(() => {
    const { sku, manageInventory, allowBackorder } = inventoryItem
    setInventoryItemData({ sku, manageInventory, allowBackorder })
  }, [inventoryItem])

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
    // TODO only subit changes
    onChange(inventoryItemData)
  }

  const { sku, manageInventory, allowBackorder } = inventoryItemData

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Text
        maxLength={63}
        name='sku'
        autoComplete='off'
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
          disabled={disabled}
        >{t('save')}
        </PrimaryButton>
      </div>
    </CardDefault>
  )
})

export default InventoryManagement
