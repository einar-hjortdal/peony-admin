import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useCountries } from '../../data'

const InputOriginCountry = component(({ label, value, onChangeHandler }) => {
  const { data } = useCountries({ fetch: 250 })
  const { translator } = useTranslation()

  if (data) {
    const { countries } = data
    const options = []
    options.push(<option value='' disabled hidden />)
    for (let i = 0, len = countries.length; i < len; i++) {
      const country = countries[i]
      const { code } = country
      options.push(
        <option key={code} value={code}>
          {code} ({translator.formatName(code.trim(), { type: 'region' })})
        </option>
      )
    }

    return (
      <label>
        {label}
        <select name='originCountry' value={value} onChange={onChangeHandler}>
          {options}
        </select>
      </label>
    )
  }

  return false
})

// inventory_quantity ?i32    @[json: 'inventoryQuantity']
// allow_backorder    ?bool   @[json: 'allowBackorder']
// manage_inventory   ?bool   @[json: 'manageInventory']
// origin_country     ?string @[json: 'originCountry']
// money_amounts      ?[]MoneyAmountRequest @[json: 'moneyAmounts']
// options            ?[]ProductOptionValueRequest

const VariantInputs = component(({ variantData, setVariantData }) => {
  const { t } = useTranslation('product.variantInputs')

  const handleLabelClick = (event) => {
    event.preventDefault()
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    const data = { ...variantData }
    data[name] = value
    setVariantData(data)
  }

  return (
    <div>
      <div>
        <label onClick={handleLabelClick}>
          {t('title')}
          <input
            type='text'
            maxLength={63}
            name='title'
            onInput={handleInput}
            value={variantData.title}
            placeholder={t('titlePlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('sku')}
          <input
            type='text'
            maxLength={63}
            name='sku'
            onInput={handleInput}
            value={variantData.sku}
            placeholder={t('skuPlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('ean')}
          <input
            type='text'
            maxLength={13}
            name='ean'
            onInput={handleInput}
            value={variantData.ean}
            placeholder={t('eanPlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('upc')}
          <input
            type='text'
            maxLength={12}
            name='upc'
            onInput={handleInput}
            value={variantData.upc}
            placeholder={t('upcPlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('barcode')}
          <input
            type='text'
            maxLength={63}
            name='barcode'
            onInput={handleInput}
            value={variantData.barcode}
            placeholder={t('barcodePlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('hsCode')}
          <input
            type='text'
            maxLength={63}
            name='hsCode'
            onInput={handleInput}
            value={variantData.hsCode}
            placeholder={t('hsCodePlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('variantRank')}
          <input
            type='number'
            step={1}
            name='variantRank'
            onInput={handleInput}
            value={variantData.variantRank}
            placeholder={t('variantRankPlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('midCode')}
          <input
            type='text'
            maxLength={63}
            name='midCode'
            onInput={handleInput}
            value={variantData.midCode}
            placeholder={t('midCodePlaceholder')}
          />
        </label>
      </div>
      <div>
        <label onClick={handleLabelClick}>
          {t('material')}
          <input
            type='text'
            maxLength={191}
            name='material'
            onInput={handleInput}
            value={variantData.material}
            placeholder={t('materialPlaceholder')}
          />
        </label>
        <InputOriginCountry
          label={t('originCountry')}
          value={variantData.originCountry}
          onChangeHandler={handleInput}
        />
      </div>

      <div>
        <label onClick={handleLabelClick}>
          {t('weight')}
          <input
            type='number'
            step={1}
            name='weight'
            onInput={handleInput}
            value={variantData.weight}
            placeholder={t('weightPlaceholder')}
          />
        </label>
        <label onClick={handleLabelClick}>
          {t('length')}
          <input
            type='number'
            step={1}
            name='length'
            onInput={handleInput}
            value={variantData.length}
            placeholder={t('lengthPlaceholder')}
          />
        </label>
        <label onClick={handleLabelClick}>
          {t('height')}
          <input
            type='number'
            step={1}
            name='height'
            onInput={handleInput}
            value={variantData.height}
            placeholder={t('heightPlaceholder')}
          />
        </label>
        <label onClick={handleLabelClick}>
          {t('width')}
          <input
            type='number'
            step={1}
            name='width'
            onInput={handleInput}
            value={variantData.width}
            placeholder={t('widthPlaceholder')}
          />
        </label>
      </div>
    </div>
  )
})

export default VariantInputs
