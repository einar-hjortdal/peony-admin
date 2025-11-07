import { component, keys, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'

import { useRegions } from '../../../data'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'
import SecondaryButton from '../../buttons/SecondaryButton'

const MoneyAmountInput = component(
  ({
    regionId,
    regionName,
    currencyCode,
    amount,
    onInput,
    onDelete,
    disabled
  }) => {
    const { t } = useTranslation('variants.moneyAmounts')

    const handleOnValueChange = (value, name, values) => {
      return onInput(value, name, values, regionId, currencyCode)
    }

    const handleDelete = () => {
      onDelete(regionId)
    }

    return (
      <div>
        <label for={regionId}>{regionName}</label>
        <CurrencyInput
          id={regionId}
          value={amount}
          onValueChange={handleOnValueChange}
          disabled={disabled}
        />
        <SecondaryButton onClick={handleDelete} disabled={disabled}>{t('delete')}</SecondaryButton>
      </div>
    )
  }
)

// each region has one currency, therefore we want one price for each region.
// moneyAmounts can be undefined, each moneyAmount has regionId and currencyCode properties.
const MoneyAmounts = component(({ moneyAmounts, onChange, disabled }) => {
  const { t } = useTranslation('variants.moneyAmounts')
  const { data: regionsData } = useRegions()

  const [regionMoneyAmountsMap, setRegionMoneyAmountsMap] = useState({})
  useEffect(() => {
    const newRegionMoneyAmountsMap = {}
    for (let i = 0, len = moneyAmounts.length; i < len; i++) {
      const moneyAmount = moneyAmounts[i]
      const { regionId } = moneyAmount // TODO if priceListId is set, ignore moneyAmount
      newRegionMoneyAmountsMap[regionId] = moneyAmount
    }
    setRegionMoneyAmountsMap(newRegionMoneyAmountsMap)
  }, [moneyAmounts])

  const handleInput = (value, name, values, currencyCode, regionId) => {
    return setRegionMoneyAmountsMap((prevState) => {
      const newPrice = { regionId, currencyCode, amount: Number(value) }
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
    const inputs = []
    for (let i = 0, len = regions.length; i < len; i++) {
      const region = regions[i]
      const { id, name, currencyCode, includesTax } = region

      let amount
      if (id in regionMoneyAmountsMap) {
        const moneyAmount = regionMoneyAmountsMap[id]
        amount = moneyAmount.amount
      }

      inputs.push(
        <MoneyAmountInput
          key={id}
          regionName={name}
          regionId={id}
          currencyCode={currencyCode}
          amount={amount}
          includesTax={includesTax}
          onInput={handleInput}
          onDelete={handleDelete}
          disabled={disabled}
        />
      )
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')} />

        {inputs}

        <PrimaryButton type='button' onClick={handleSave} disabled={disabled}>
          {t('save')}
        </PrimaryButton>
      </CardDefault>
    )
  }
})

export default MoneyAmounts
