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
  const { requiresShipping, material, weight, length, height, width } = inventoryItemData
  const { t } = useTranslation('inventoryItems.shipping.properties')
  if (!requiresShipping) {
    return false
  }

  return (
    <>
      {/*
      TODO if ships internationally -> origin country, hs_code inputs
      we don't have a boolean to control this, derive it if origin country or hs_code are set
      or always show in non-annoying way
      */}

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
        placeholder={t('weightPlaceholder')}
      >{t('weight')}
      </I32>
      {/*
      TODO add unit, conversion.
      What unit to use as default? gram?
      */}

      <I32
        name='length'
        onInput={onInput}
        value={length}
        placeholder={t('lengthPlaceholder')}
      >{t('length')}
      </I32>

      <I32
        name='height'
        onInput={onInput}
        value={height}
        placeholder={t('heightPlaceholder')}
      >{t('height')}
      </I32>

      <I32
        name='width'
        onInput={onInput}
        value={width}
        placeholder={t('widthPlaceholder')}
      >{t('width')}
      </I32>
    </>
  )
})

const Shipping = component(({ productId, variantId, inventoryItem }) => {
  const { id } = inventoryItem
  const { t } = useTranslation('inventoryItems.shipping')
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
