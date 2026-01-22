import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import Switch from '../../components/Switch'
import { useStore, useUpdateCurrencyMutation } from '../../data'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'

const CurrenciesTable = styled.table`
  width: 100%;
  text-align: right;
  & thead tr th {
  }
  & thead tr th:first-child {
    text-align: left;
  }
  & tbody tr td:first-child {
    text-align: left;
  }
`

const SwitchLabel = styled.span`
  display: none;
`

const StoreCurrencies = component(() => {
  const { t, translator } = useTranslation('currencies.storeCurrencies')
  const { data: storeData } = useStore()
  const [
    updateCurrency,
    { isFetching: updateCurrencyIsFetching }
  ] = useUpdateCurrencyMutation()

  const handleTaxInclusive = (e, newValue) => {
    if (updateCurrencyIsFetching) {
      return
    }

    const { code } = e.target.dataset
    updateCurrency(code, { includesTax: newValue })
  }

  // TODO when storeIsFetching || updateCurrencyIsFetching
  if (storeData) {
    const { currencies } = storeData.store
    const rows = []
    for (let i = 0, len = currencies.length; i < len; i++) {
      const { code, includesTax } = currencies[i]
      // trim whitespaces because database reads char weird
      const translatedName = translator.formatName(code.trim(), { type: 'currency' })
      rows.push(
        <tr>
          <td>
            {code}
            <span>{translatedName}</span>
          </td>
          <td>
            <Switch
              data-code={code}
              checked={includesTax}
              onChange={(e) => handleTaxInclusive(e, !includesTax)}
              disabled={updateCurrencyIsFetching}
            ><SwitchLabel aria-hidden>{t('includesTax')}</SwitchLabel>
            </Switch>
          </td>
        </tr>
      )
    }

    return (
      <CurrenciesTable>
        <thead>
          <tr>
            <th>{t('currency')}</th>
            <th>{t('includesTax')}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </CurrenciesTable>
    )
  }
})

const Currencies = component(() => {
  const { t } = useTranslation('currencies')

  return (
    <CardDefault>
      <CardHeader title={t('title')} subtitle={t('description')}>
        {/* more? */}
      </CardHeader>
      <StoreCurrencies />
    </CardDefault>
  )
})

export default Currencies
