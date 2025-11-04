import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useInventoryItemUpdateMutation } from '../../../data'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'
import I32 from '../../input/I32'
import Checkbox from '../../input/Checkbox'

const Properties = component(({ inventoryItemData, onInput }) => {
  const {
    requiresShipping,
    material,
    weight,
    length,
    height,
    width,
    hsCode,
    midCode
  } = inventoryItemData
  const { t } = useTranslation('variants.shipping.properties')
  if (!requiresShipping) {
    return false
  }

  return (
    <>
      <Text
        maxLength={63}
        name='material'
        onInput={onInput}
        value={material}
        placeholder={t('materialPlaceholder')}
      >{t('material')}
      </Text>

      <I32
        name='weight'
        onInput={onInput}
        value={weight}
      >{t('weight')}
      </I32>
      {/* TODO add units, conversion. Store on db as gram */}

      <I32
        name='length'
        onInput={onInput}
        value={length}
      >{t('length')}
      </I32>

      <I32
        name='height'
        onInput={onInput}
        value={height}
      >{t('height')}
      </I32>

      <I32
        name='width'
        onInput={onInput}
        value={width}
      >{t('width')}
      </I32>

      {/* TODO international section */}
      {/* TODO origin country (fetch countries as options, must do many fetch calls or one on input debounced) */}
      <Text
        maxLength={63}
        name='mid'
        onInput={onInput}
        value={hsCode}
      >{t('hsCode')}
      </Text>

      <Text
        maxLength={15}
        name='mid'
        onInput={onInput}
        value={midCode}
      >{t('midCode')}
      </Text>
    </>
  )
})

const Shipping = component(({ productId, variantId, inventoryItem }) => {
  const { id } = inventoryItem
  const { t } = useTranslation('variants.shipping')
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

      if (type === 'number') {
        return { ...prevState, [name]: Number(value) }
      }

      return { ...prevState, [name]: value }
    })
  }

  const handleSave = () => {
    // TODO only subit changes and only submit relevant properties
    updateInventoryItem(inventoryItemData)
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Checkbox
        name='requiresShipping'
        onChange={handleInput}
        checked={inventoryItemData.requiresShipping}
      >{t('requiresShipping')}
      </Checkbox>

      <Properties inventoryItemData={inventoryItemData} onInput={handleInput} />

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

export default Shipping
