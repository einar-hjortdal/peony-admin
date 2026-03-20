import { component, detectIsUndefined, useMemo, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'

import { useCurrencies, useRegions } from '../../data'

const Gate = component(({ variants, slot }) => {
  if (detectIsUndefined(variants)) {
    return null
  }
  return slot
})

const TableHeadings = component(({ regions }) => {
  const { t } = useTranslation('products.pricesInputs')
  const headings = []
  headings.push(<th>{t('variant')}</th>) // TODO format
  for (let i = 0, len = regions.length; i < len; i++) {
    const region = regions[i]
    headings.push(
      <>
        <th>{region.name} {t('originalPrice')} {region.currencyCode} {region.includesTax}</th>
        <th>{region.name} {t('basePrice')} {region.currencyCode} {region.includesTax}</th>
      </>
    )
  }
  return <tr>{headings}</tr>
})

const TableRow = component(({ variant, regions, currencies, onInput, disabled }) => {
  const { translator } = useTranslation()
  const { regionalPrices } = variant

  const currenciesMap = useMemo(() => {
    const res = {}
    for (let i = 0, len = currencies.length; i < len; i++) {
      const currency = currencies[i]
      res[currency.code] = currency
    }
  }, [currencies])

  const cells = []
  cells.push(<td>{variant.title}</td>) // TODO may be undefined, need fallback
  for (let i = 0, len = regions.length; i < len; i++) {
    const region = regions[i]
    const regionalPrice = regionalPrices[region.id]
    const { currencyCode, originalPrice, basePrice } = regionalPrice
    const currency = currenciesMap[currencyCode]
    const intlConfig = {
      locale: translator.currentLanguage,
      currency: currencyCode.trim() // firebirdsql returns additional whitespace for some reason
    }

    cells.push(
      <>
        <td>
          <CurrencyInput
            value={originalPrice}
            intlConfig={intlConfig}
            decimalsLimit={currency.decimalDigits}
            step={1}
            onValueChange={onInput}
            disabled={disabled}
          />
        </td>
        <td>
          <CurrencyInput
            value={basePrice}
            intlConfig={intlConfig}
            decimalsLimit={currency.decimalDigits}
            step={1}
            onValueChange={onInput}
            disabled={disabled}
          />
        </td>
      </>
    )
  }
  return <tr>{cells}</tr>
})

const TableBody = component(({ variants, regions, onInput, disabled }) => {
  const rows = []
  for (let i = 0, len = variants.length; i < len; i++) {
    const variant = variants[i]
    rows.push(
      <TableRow
        key={variant.id}
        regions={regions}
        onInput={onInput}
        disabled={disabled}
      />
    )
  }
  return rows
})

// Handles product variants prices. Usable both in product creation and editing.
// Handles basePrice and originalPrice.
// TODO handle unit price (need server impl)
// Other price-related functionality should be handled elsewhere.
// onSave callback returns variants array with edited prices.

const PricesTable = component(({ currencies, regions, variants, onSave, disabled }) => {
  const { t } = useTranslation('products.pricesInputs')

  // we want 2 columns for each region: originalPrice and basePrice

  const [variantsData, setVariantsData] = useState([...variants])

  const handleClear = () => {
    setVariantsData([...variants])
  }

  const handleSave = () => {
    onSave(variantsData)
  }

  const handleInput = (data) => {
    console.log(data)
  }

  return (
    <table>
      <TableHeadings regions={regions} />
      <TableBody
        variants={variants}
        regions={regions}
        currencies={currencies}
        onInput={handleInput}
        disabled={disabled}
      />
    </table>
  )
})

const CurrenciesWrapper = component(({ regions, variants, onSave, disabled }) => {
  const currencyCodes = useMemo(() => {
    const res = []
    for (let i = 0, len = regions.length; i < len; i++) {
      const region = regions[i]
      res.push(region.currencyCode)
    }
  }, [regions])
  const { data: currenciesData } = useCurrencies({ codes: currencyCodes })
  if (currenciesData) {
    const { currencies } = currenciesData
    return (
      <PricesTable
        currencies={currencies}
        regions={regions}
        variants={variants}
        onSave={onSave}
        disabled={disabled}
      />
    )
  }
})

const RegionsWrapper = component(({ variants, onSave, disabled }) => {
  const { data: regionsData } = useRegions()
  if (regionsData) {
    const { regions } = regionsData
    return (
      <CurrenciesWrapper
        regions={regions}
        variants={variants}
        onSave={onSave}
        disabled={disabled}
      />
    )
  }
})

const PricesInputs = component((variants, onSave, disabled) => {
  return (
    <Gate variants={variants}>
      <RegionsWrapper
        variants={variants}
        onSave={onSave}
        disabled={disabled}
      />
    </Gate>
  )
})

export default PricesInputs
