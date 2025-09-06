import { component, detectIsEmpty, detectIsUndefined, keys, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useCountries, useProductById, useStore } from '../../data'

const OptionValues = component(({ productId, variantData, setVariantData }) => {
  const { t } = useTranslation('product.variantInputs.optionValues')
  const { data: storeData, error: storeError } = useStore()
  const { data: productData, error: productError } = useProductById(productId)
  const [optionValuesData, setOptionValuesData] = useState({})

  useEffect(() => {
    if (detectIsEmpty(storeData) || detectIsEmpty(productData)) {
      return
    }

    const { options } = productData.product
    const { optionValues } = variantData
    if (detectIsUndefined(options)) {
      return
    }

    // handle new variant
    if (detectIsUndefined(optionValues)) {
      const newOptionValuesData = {}
      for (let i = 0, len = options.length; i < len; i++) {
        const option = options[i]
        const { id } = option
        newOptionValuesData[id] = {}
      }
      return setOptionValuesData(newOptionValuesData)
    }

    // handle edit variant
    const newOptionValuesData = {}
    for (let i = 0, len = optionValues.length; i < len; i++) {
      const optionValue = optionValues[i]
      const { optionId, translations } = optionValue
      newOptionValuesData[optionId] = translations
    }
    return setOptionValuesData(newOptionValuesData)
  }, [storeData, productData, variantData])

  if (productData) {
    const { options } = productData.product

    // no inputs if no options
    if (detectIsUndefined(options)) {
      return null
    }

    const getValue = (id, localeId) => {
      const optionValues = optionValuesData[id]
      if (detectIsUndefined(optionValues)) {
        return ''
      }

      for (let i = 0, len = optionValues.length; i < len; i++) {
        const optionValue = optionValues[i]
        if (optionValue.localeId === localeId) {
          return optionValue.name
        }
      }
      return ''
    }

    const handleLabelClick = (e) => {
      e.preventDefault()
    }

    const handleInput = (e) => {
      const { name, value } = e.target
      const { localeId } = e.target.dataset
      setOptionValuesData((prevState) => {
        const newOptionValue = { [localeId]: value }
        const newOptionValuesData = { ...prevState, [name]: newOptionValue }
        return newOptionValuesData
      })
    }

    // TODO fix missed blur events when user submits with enter or clicks immediately on submit button
    const handleBlur = () => {
      setVariantData((prevState) => {
        const newOptionValues = []
        const optionIds = keys(optionValuesData)
        for (let i = 0, len = optionIds.length; i < len; i++) {
          const optionId = optionIds[i]
          const translations = optionValuesData[optionId]
          const localeIds = keys(translations)
          if (localeIds.length === 0) {
            continue
          }

          const newTranslations = []
          for (let j = 0, len = localeIds.length; j < len; j++) {
            const localeId = localeIds[j]
            const translation = translations[localeId]
            newTranslations.push({ localeId, name: translation })
          }
          newOptionValues.push({ optionId, translations: newTranslations })
        }

        return { ...prevState, optionValues: newOptionValues }
      })
    }

    const { defaultLocaleId } = storeData.store
    const getOptionTitle = (translations) => {
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        const { localeId, title } = translation
        if (localeId === defaultLocaleId) {
          return title
        }
      }
    }

    const inputs = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { id, translations } = option
      inputs.push(
        <label key={id} onClick={handleLabelClick}>
          {getOptionTitle(translations)}
          <input
            type='text'
            maxLength={63}
            name={id}
            data-locale-id={defaultLocaleId}
            onInput={handleInput}
            onBlur={handleBlur}
            value={getValue(id, defaultLocaleId)}
            placeholder={t('placeholder')}
            required
          />
          <fieldset>
            <legend>{t('translations')}</legend>
            {/* TODO */}
          </fieldset>
        </label>
      )
    }

    return (
      <fieldset>
        <legend>{t('options')}</legend>
        {inputs}
      </fieldset>
    )
  }

  return null
})

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
        <select
          name='originCountry'
          autoComplete='off'
          value={value}
          onChange={onChangeHandler}
        >
          {options}
        </select>
      </label>
    )
  }

  return null
})

// allow_backorder    ?bool   @[json: 'allowBackorder']
// manage_inventory   ?bool   @[json: 'manageInventory']
// origin_country     ?string @[json: 'originCountry']
// money_amounts      ?[]MoneyAmountRequest @[json: 'moneyAmounts']

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

      <OptionValues
        productId={productId}
        variantData={variantData}
        setVariantData={setVariantData}
      />

      <fieldset>
        <label onClick={handleLabelClick}>
          {t('variantRank')}
          <input
            type='number'
            step={1}
            autoComplete='off'
            name='variantRank'
            onInput={handleInput}
            value={variantData.variantRank}
            placeholder={t('variantRankPlaceholder')}
          />
        </label>
      </fieldset>

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
