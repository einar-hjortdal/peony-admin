import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'
import Switch from '../components/Switch'
import Button from '../components/Button'
import {
  useCurrencies,
  useStore,
  useStoreUpdateMutation,
  useUpdateCurrencyMutation
} from '../data'
import { currentPage, totalPages } from '../utils_data'

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

  // TODO when storeIsFetching || updateCurrencyIsFetching show skeleton
  if (storeData) {
    const rows = []
    for (let i = 0, len = storeData.currencies.length; i < len; i++) {
      const { code, includesTax } = storeData.currencies[i]
      rows.push(
        <tr>
          <td>{code} <span>{translator.formatName(code.trim(), { type: 'currency' })}</span></td>
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
    const { value } = e.target
    updateStore({ defaultCurrencyCode: value })
  }

  if (storeData) {
    const { currencies, defaultCurrencyCode } = storeData
    const options = []
    for (let i = 0, len = currencies.length; i < len; i++) {
      const { code } = currencies[i]
      options.push(<option key={code}>{code}</option>)
    }

    return (
      <div>
        <div>
          {t('title')}
        </div>
        {t('description')}
        <div>
          <select
            title={t('title')}
            name={t('title')}
            value={defaultCurrencyCode}
            onChange={handleChange}
            disabled={updateStoreIsFetching}
          >{options}
          </select>
        </div>
      </div>
    )
  }
})

const Modal = component(({ modalRef }) => {
  const { t, translator } = useTranslation('currencies.modal')
  const [params, setParams] = useState([])
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()
  const {
    data: currenciesData,
    isFetching: currenciesIsFetching,
    error: currenciesError
  } = useCurrencies()
  const [updateStore, {
    data: updateStoreData,
    isFetching: updateStoreIsFetching,
    error: updateStoreError
  }] = useStoreUpdateMutation()

  useEffect(() => {
    if (!storeData) {
      return
    }

    const { currencies } = storeData
    const newState = []
    for (let i = 0, len = currencies.length; i < len; i++) {
      const currency = currencies[i]
      newState.push(currency.code)
    }
    setParams(newState)
    console.log('useEffect ran')
  }, [storeData])

  const handleClick = (e) => {
    if (updateStoreIsFetching) {
      return
    }

    updateStore(storeData.id, { currencies: params })
  }

  // Note: do not allow removing default currency.
  if (storeData && currenciesData) {
    const names = []
    for (let i = 0, len = currenciesData.items.length; i < len; i++) {
      const code = currenciesData.items[i].code.trim() // trim whitespaces because database reads char weird
      const name = translator.formatName(code, { type: 'currency' })
      let selected = false
      for (let k = 0, len = params.length; k < len; k++) {
        if (params[k] === code) {
          selected = true
          break
        }
      }
      names.push(<div $selected={selected}>{name}</div>)
    }
    return (
      <dialog ref={modalRef}>
        <div>
          <div>{names}</div>
          <button
            type='button'
            onClick={handleClick}
            disabled={updateStoreIsFetching}
          >{t('apply')}
          </button>
          <div>count: {currenciesData.count}</div>
          current page: {currentPage(currenciesData.offset, currenciesData.fetch)}
          total pages: {totalPages(currenciesData.count, currenciesData.fetch)}
        </div>
      </dialog>
    )
  }
})

const ColumnLarge = styled.div`
  padding: .75rem;
  box-sizing: border-box;
  vertical-align: top;
  display: inline-block;
  width: 60%;
`

const ColumnSmall = styled.div`
  padding: .75rem;
  box-sizing: border-box;
  vertical-align: top;
  display: inline-block;
  width: 40%;
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

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  if (storeData) {
    return (
      <>
        <ColumnLarge>
          <Card>
            <CardTitle>{t('title')}</CardTitle>
            <div><span>{t('description')}</span></div>
            <Button $variant='primary' onClick={handleOpenModal}>{t('addCurrency')}</Button>
            <StoreCurrencies />
          </Card>
        </ColumnLarge>
        <ColumnSmall>
          <Card>
            <DefaultCurrency />
          </Card>
        </ColumnSmall>
        <Modal modalRef={modalRef} />
      </>
    )
  }
})

export default Currencies
