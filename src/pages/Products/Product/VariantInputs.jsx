import {
  component,
  detectIsEmpty,
  detectIsUndefined,
  keys,
  useEffect,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { useProductOptions } from '../../../data'

// allow_backorder    ?bool   @[json: 'allowBackorder']
// manage_inventory   ?bool   @[json: 'manageInventory']
// origin_country     ?string @[json: 'originCountry']
// money_amounts      ?[]MoneyAmountRequest @[json: 'moneyAmounts']

const OptionSelect = component((option) => {
  const { values } = option

  const selectOptions = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]
    const { id, name } = value
    selectOptions.push(<option key={id} value={id}>{name}</option>)
  }

  return (
    <select>
      {selectOptions}
    </select>
  )
})

// This component will not be shown when there exists only one option with only one value.
// This component could get the whole product, so that it could immediately check if a variant already
// exists with the selected option values.
// This can be handled by the parent component instead, or just by the server on submission.
const Options = component(({ productId, variantData, onChange }) => {
  const { data: optionsData } = useProductOptions(productId)
  if (optionsData) {
    const { options } = optionsData
    if (options.length === 1 && options[0].values.length === 1) {
      return null
    }

    const selectComponents = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { id } = option
      selectComponents.push(<OptionSelect key={id} productOption={option} />)
    }
    return selectComponents
  }
})

const VariantInputs = component(({ productId, variantData, setVariantData }) => {
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

  // TODO
  const handleOptionChange = (data) => {
    setVariantData(data)
  }

  return (
    <div>
      <fieldset>
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
      </fieldset>

      <Options
        productId={productId}
        variantData={variantData}
        onChange={handleOptionChange}
      />

      <fieldset>
        <label onClick={handleLabelClick}>
          {t('barcode')}
          <input
            type='text'
            maxLength={63}
            autoComplete='off'
            name='barcode'
            onInput={handleInput}
            value={variantData.barcode}
            placeholder={t('barcodePlaceholder')}
          />
        </label>
        <label onClick={handleLabelClick}>
          {t('ean')}
          <input
            type='text'
            maxLength={13}
            autoComplete='off'
            name='ean'
            onInput={handleInput}
            value={variantData.ean}
            placeholder={t('eanPlaceholder')}
          />
        </label>
        <label onClick={handleLabelClick}>
          {t('upc')}
          <input
            type='text'
            maxLength={12}
            autoComplete='off'
            name='upc'
            onInput={handleInput}
            value={variantData.upc}
            placeholder={t('upcPlaceholder')}
          />
        </label>
      </fieldset>
    </div>
  )
})

export default VariantInputs
