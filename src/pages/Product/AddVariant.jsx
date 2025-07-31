import {
  component,
  detectIsNull,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import {
  useStore,
  useProductById,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useCountries
} from '../../data'

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

const AddVariant = component(({ productId }) => {
  const { t } = useTranslation('product.addVariant')
  const [variantData, setVariantData] = useState({})
  const [createVariant, {
    data: createVariantData,
    isFetching: createVariantIsFetching,
    error: createVariantError
  }] = useCreateVariantMutation(productId)
  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.close()
  }

  const handleCreate = () => {
    createVariant(variantData)
  }

  const handleLabelClick = (event) => {
    event.preventDefault()
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    const data = { ...variantData }
    data[name] = value
    console.log(name, value)
    setVariantData(data)
  }

  // inventory_quantity ?i32    @[json: 'inventoryQuantity']
  // allow_backorder    ?bool   @[json: 'allowBackorder']
  // manage_inventory   ?bool   @[json: 'manageInventory']
  // origin_country     ?string @[json: 'originCountry']
  // money_amounts      ?[]MoneyAmountRequest @[json: 'moneyAmounts']
  // options            ?[]ProductOptionValueRequest

  return (
    <>
      <button type='button' onClick={handleOpenModal}>add variant</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputTitle')}
              <input
                type='text'
                maxLength={63}
                name='title'
                onInput={handleInput}
                value={variantData.title}
                placeholder={t('inputTitlePlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputSku')}
              <input
                type='text'
                maxLength={63}
                name='sku'
                onInput={handleInput}
                value={variantData.sku}
                placeholder={t('inputSkuPlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputEan')}
              <input
                type='text'
                maxLength={13}
                name='ean'
                onInput={handleInput}
                value={variantData.ean}
                placeholder={t('inputEanPlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputUpc')}
              <input
                type='text'
                maxLength={12}
                name='upc'
                onInput={handleInput}
                value={variantData.upc}
                placeholder={t('inputUpcPlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputBarcode')}
              <input
                type='text'
                maxLength={63}
                name='barcode'
                onInput={handleInput}
                value={variantData.barcode}
                placeholder={t('inputBarcodePlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputHsCode')}
              <input
                type='text'
                maxLength={63}
                name='hsCode'
                onInput={handleInput}
                value={variantData.hsCode}
                placeholder={t('inputHsCodePlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputVariantRank')}
              <input
                type='number'
                step={1}
                name='variantRank'
                onInput={handleInput}
                value={variantData.variantRank}
                placeholder={t('inputVariantRankPlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputMidCode')}
              <input
                type='text'
                maxLength={63}
                name='midCode'
                onInput={handleInput}
                value={variantData.midCode}
                placeholder={t('inputMidCodePlaceholder')}
              />
            </label>
          </div>
          <div>
            <label onClick={handleLabelClick}>
              {t('inputMaterial')}
              <input
                type='text'
                maxLength={191}
                name='material'
                onInput={handleInput}
                value={variantData.material}
                placeholder={t('inputMaterialPlaceholder')}
              />
            </label>
            <InputOriginCountry
              label={t('inputOriginCountry')}
              value={variantData.originCountry}
              onChangeHandler={handleInput}
            />
          </div>

          <div>
            <label onClick={handleLabelClick}>
              {t('inputWeight')}
              <input
                type='number'
                step={1}
                name='weight'
                onInput={handleInput}
                value={variantData.weight}
                placeholder={t('inputWeightPlaceholder')}
              />
            </label>
            <label onClick={handleLabelClick}>
              {t('inputLength')}
              <input
                type='number'
                step={1}
                name='length'
                onInput={handleInput}
                value={variantData.length}
                placeholder={t('inputLengthPlaceholder')}
              />
            </label>
            <label onClick={handleLabelClick}>
              {t('inputHeight')}
              <input
                type='number'
                step={1}
                name='height'
                onInput={handleInput}
                value={variantData.height}
                placeholder={t('inputHeightPlaceholder')}
              />
            </label>
            <label onClick={handleLabelClick}>
              {t('inputWidth')}
              <input
                type='number'
                step={1}
                name='width'
                onInput={handleInput}
                value={variantData.width}
                placeholder={t('inputWidthPlaceholder')}
              />
            </label>
          </div>

          <div>
            <button
              type='button'
              onClick={handleCreate}
              disabled={createVariantIsFetching}
            >create
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
})

export default AddVariant
