import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

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
        maxLength={191}
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
        name='hsCode'
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

// TODO should be able to be used in variant creation too: can't call mutation here.
const Shipping = component(({ inventoryItem, onChange, disabled }) => {
  const { t } = useTranslation('variants.shipping')
  const [inventoryItemData, setInventoryItemData] = useState(inventoryItem)
  useEffect(() => {
    const {
      requiresShipping,
      material,
      weight,
      length,
      height,
      width,
      hsCode,
      midCode
    } = inventoryItem

    setInventoryItemData({
      requiresShipping,
      material,
      weight,
      length,
      height,
      width,
      hsCode,
      midCode
    })
  }, [inventoryItem])

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
    // TODO only return changes
    onChange(inventoryItemData)
  }

  const { requiresShipping } = inventoryItemData

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <Checkbox
        name='requiresShipping'
        onChange={handleInput}
        checked={requiresShipping}
      >{t('requiresShipping')}
      </Checkbox>

      <Properties inventoryItemData={inventoryItemData} onInput={handleInput} />

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

export default Shipping
