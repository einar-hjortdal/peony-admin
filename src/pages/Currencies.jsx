import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'
import Switch from '../components/Switch'
import { useStore } from '../data'
import Button from '../components/Button'

const StoreCurrencies = component(() => {
  const { t } = useTranslation('currencies.storeCurrencies')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  const handleTaxInclusive = (e) => {
    const { checked } = e.target
    const { currency } = e.target.dataset
    console.log(currency, checked)
  }

  if (storeData) {
    const rows = []
    for (let i = 0, len = storeData.currencies.length; i < len; i++) {
      rows.push(
        <div>
          {storeData.currencies[i].code}
          <Switch data-currency='bro' onClick={handleTaxInclusive}>{t('includesTax')}</Switch>
        </div>
      )
    }
    return rows
  }
})

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
        <Card>
          <Card.Header>{t('title')}</Card.Header>

          <div>default store currency: {storeData.defaultCurrencyCode}</div>
          <StoreCurrencies />
          <Button $variant='primary'>{t('edit')}</Button>
        </Card>
      </>
    )
  }
})

export default Currencies
