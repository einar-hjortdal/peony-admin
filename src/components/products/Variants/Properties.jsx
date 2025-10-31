import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useInventoryItemUpdateMutation } from '../../../data'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'
import I32 from '../../input/I32'

const Properties = component(({ productId, variantId, inventoryItem }) => {
  const { id } = inventoryItem
  const { t } = useTranslation('variant.inventoryItem.properties')
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

  const { material, weight, length, height, width } = inventoryItemData

  const handleInput = (e) => {
    const { name, value, type } = e.target
    setInventoryItemData((prevState) => {
      if (type === 'number') {
        return { ...prevState, [name]: Number(value) }
      }
      return { ...prevState, [name]: value }
    })
  }

  const handleSave = () => {
    updateInventoryItem(inventoryItemData)
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Text
        maxLength={63}
        name='material'
        onInput={handleInput}
        value={material}
        placeholder={t('materialPlaceholder')}
      >{t('material')}
      </Text>

      <I32
        name='weight'
        onInput={handleInput}
        value={weight}
        placeholder={t('weightPlaceholder')}
      />

      <I32
        name='length'
        onInput={handleInput}
        value={length}
        placeholder={t('lengthPlaceholder')}
      />

      <I32
        name='height'
        onInput={handleInput}
        value={height}
        placeholder={t('heightPlaceholder')}
      />

      <I32
        name='width'
        onInput={handleInput}
        value={width}
        placeholder={t('widthPlaceholder')}
      />

      <PrimaryButton
        type='button'
        onClick={handleSave}
        disabled={updateInventoryItemIsFethcing}
      >{t('save')}
      </PrimaryButton>
    </CardDefault>
  )
})

export default Properties
