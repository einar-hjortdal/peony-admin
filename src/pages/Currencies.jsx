import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'
import Switch from '../components/Switch'
import { useStore, useUpdateCurrencyMutation } from '../data'
import Button from '../components/Button'
import { styled } from '@dark-engine/styled'

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
  const { t } = useTranslation('currencies.storeCurrencies')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()
  const [updateCurrency, {
    data: updateCurrencyData,
    isFetching: updateCurrencyIsFetching,
    error: updateCurrencyError
  }] = useUpdateCurrencyMutation()

  const handleTaxInclusive = (e, newValue) => {
    if (updateCurrencyIsFetching) {
      return
    }

    const { code } = e.target.dataset
    updateCurrency(code, { includesTax: newValue })
  }

  if (storeData) {
    const rows = []
    for (let i = 0, len = storeData.currencies.length; i < len; i++) {
      const { code, includesTax } = storeData.currencies[i]
      rows.push(
        <tr>
          <td>{code}</td>
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

const ColumnLarge = styled.div`
  padding: .75rem;
  box-sizing: border-box;
  vertical-align: top;
  display: inline-block;
  width: 80%;
`

const ColumnSmall = styled.div`
  padding: .75rem;
  box-sizing: border-box;
  vertical-align: top;
  display: inline-block;
  width: 20%;
`

const CardTitle = styled.h2`
  font-size: 130%;
  padding: 0 0 1.5rem;
`

const Currencies = component(() => {
  const { t } = useTranslation('currencies')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  if (storeData) {
    return (
      <>
        <ColumnLarge>
          <Card>
            <CardTitle>{t('title')}</CardTitle>
            <Button $variant='primary'>{t('edit')}</Button>
            <StoreCurrencies />
          </Card>
        </ColumnLarge>
        <ColumnSmall>
          <Card>
            <div>default store currency: {storeData.defaultCurrencyCode}</div>
          </Card>
        </ColumnSmall>
      </>
    )
  }
})

export default Currencies
