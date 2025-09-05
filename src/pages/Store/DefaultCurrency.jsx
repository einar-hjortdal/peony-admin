import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore, useStoreUpdateMutation } from '../../data'
import Card from '../../components/Card'

const DefaultCurrencySelect = styled.select`
  display: block;
  width: 100%;
`

const DefaultCurrency = component(() => {
  const { t } = useTranslation('currencies.defaultCurrency')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()
  const [updateStore, {
    data: updateStoreData,
    isFetching: updateStoreIsFetching,
    error: updateStoreError
  }] = useStoreUpdateMutation()

  const handleChange = (e) => {
    if (updateStoreIsFetching) {
      return
    }
    const { value } = e.target
    updateStore(storeData.store.id, { defaultCurrencyCode: value })
  }

  if (storeData) {
    const { currencies, defaultCurrencyCode } = storeData.store
    const options = []
    for (let i = 0, len = currencies.length; i < len; i++) {
      const { code } = currencies[i]
      options.push(
        <option
          key={code}
          value={code}
          selected={defaultCurrencyCode === code}
        >{code}
        </option>
      )
    }

    return (
      <Card>
        <Card.Header title={t('title')} />
        <Card.Body>
          <label>
            {t('description')}
            <DefaultCurrencySelect
              title={t('title')}
              name={t('title')}
              onChange={handleChange}
              disabled={updateStoreIsFetching}
            >{options}
            </DefaultCurrencySelect>
          </label>
        </Card.Body>
      </Card>
    )
  }
})

export default DefaultCurrency
