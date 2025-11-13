import { component, keys, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'

import { useRegions, useStore } from '../../../data'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'
import SecondaryButton from '../../buttons/SecondaryButton'
import If from '../../If'

const MoneyAmountInput = component(
  ({
    region,
    currency,
    amount,
    onInput,
    onDelete,
    disabled
  }) => {
    const { t, translator } = useTranslation('variants.moneyAmounts')

    const { decimalDigits } = currency
    const { id, name, currencyCode, includesTax } = region

    const intlConfig = {
      locale: translator.currentLanguage,
      currency: currencyCode.trim() // firebirdsql returns additional whitespace for some reason
    }

    const handleOnValueChange = (value, name, values) => {
      return onInput(value, name, values, id)
    }

    const handleDelete = () => {
      onDelete(id)
    }

    return (
      <div>
        <label for={id}>{name} {currencyCode}
          <If condition={includesTax}>
            {t('includesTax')}
          </If>
        </label>
        {/* TODO display currency and if includes tax */}
        <CurrencyInput
          id={id}
          name={id}
          value={amount}
          intlConfig={intlConfig}
          decimalsLimit={decimalDigits}
          step={1}
          onValueChange={handleOnValueChange}
          disabled={disabled}
        />
        <SecondaryButton onClick={handleDelete} disabled={disabled}>{t('delete')}</SecondaryButton>
      </div>
    )
  }
)

const MoneyAmountsInputs = component(
  ({ regions, regionMoneyAmountsMap, onInput, onDelete, disabled }) => {
    const { data: storeData } = useStore()

    if (storeData) {
      const { currencies } = storeData.store
      const currenciesMap = {}
      for (let i = 0, len = currencies.length; i < len; i++) {
        const currency = currencies[i]
        const { code } = currency
        currenciesMap[code] = currency
      }

      const inputs = []
      for (let i = 0, len = regions.length; i < len; i++) {
        const region = regions[i]
        const { id, currencyCode } = region

        const currency = currenciesMap[currencyCode]

        let amount
        if (id in regionMoneyAmountsMap) {
          const moneyAmount = regionMoneyAmountsMap[id]
          amount = moneyAmount.amount
        }

        inputs.push(
          <MoneyAmountInput
            key={id}
            region={region}
            currency={currency}
            amount={amount}
            onInput={onInput}
            onDelete={onDelete}
            disabled={disabled}
          />
        )
      }

      return inputs
    }
  }
)

// each region has one currency, therefore we want one price for each region.
// moneyAmounts can be undefined, each moneyAmount has regionId and currencyCode properties.
const MoneyAmounts = component(({ moneyAmounts, onChange, disabled }) => {
  const { t } = useTranslation('variants.moneyAmounts')
  const { data: regionsData } = useRegions()

  const [regionMoneyAmountsMap, setRegionMoneyAmountsMap] = useState({})
  useEffect(() => {
    if (moneyAmounts) {
      const newRegionMoneyAmountsMap = {}
      for (let i = 0, len = moneyAmounts.length; i < len; i++) {
        const moneyAmount = moneyAmounts[i]
        const { regionId } = moneyAmount // TODO if priceListId is set, ignore moneyAmount
        newRegionMoneyAmountsMap[regionId] = moneyAmount
      }
      setRegionMoneyAmountsMap(newRegionMoneyAmountsMap)
    }
  }, [moneyAmounts])

  const handleInput = (value, name, values, regionId) => {
    return setRegionMoneyAmountsMap((prevState) => {
      const newPrice = { regionId, amount: Number(value) }
      return { ...prevState, [regionId]: newPrice }
    })
  }

  const handleDelete = (regionId) => {
    return setRegionMoneyAmountsMap((prevState) => {
      const newRegionMoneyAmountsMap = { ...prevState }
      delete newRegionMoneyAmountsMap[regionId]
      return newRegionMoneyAmountsMap
    })
  }

  const handleSave = () => {
    // TODO insert each moneyAmount from original array that has priceListId set
    const newMoneyAmounts = []
    const regionIds = keys(regionMoneyAmountsMap)
    for (let i = 0, len = regionIds.length; i < len; i++) {
      const regionId = regionIds[i]
      const moneyAmount = regionMoneyAmountsMap[regionId]
      const { amount, currencyCode } = moneyAmount
      newMoneyAmounts.push({ regionId, currencyCode, amount })
    }
    onChange(newMoneyAmounts)
  }

  if (regionsData) {
    const { regions } = regionsData

    return (
      <CardDefault>
        <CardHeader title={t('title')} />

        <MoneyAmountsInputs
          regions={regions}
          regionMoneyAmountsMap={regionMoneyAmountsMap}
          onInput={handleInput}
          onDelete={handleDelete}
          disabled={disabled}
        />

        <PrimaryButton type='button' onClick={handleSave} disabled={disabled}>
          {t('save')}
        </PrimaryButton>
      </CardDefault>
    )
  }
})

export default MoneyAmounts
