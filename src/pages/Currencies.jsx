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
    updateStore(storeData.id, { defaultCurrencyCode: value })
  }

  if (storeData) {
    const { currencies, defaultCurrencyCode } = storeData
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
      <div>
        <div>
          {t('title')}
        </div>
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
      </div>
    )
  }
})

const Currency = component(({ code, defaultCurrencyCode, translatedName, value, handleChange }) => {
  return (
    <div>
      {translatedName}
      <input
        type='checkbox'
        value={value}
        data-currency-code={code}
        onChange={handleChange}
        disabled={code === defaultCurrencyCode}
      />
    </div>
  )
})

const Modal = component(({ modalRef }) => {
  const { t, translator } = useTranslation('currencies.modal')
  const [offset, setOffset] = useState(0)
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
  } = useCurrencies({ offset })
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
  }, [storeData])

  const handleClose = () => {
    if (!modalRef) {
      return
    }
    modalRef.current.close()
  }

  const handlePagination = (e) => {
    if (currenciesIsFetching) {
      return
    }

    const { name } = e.target
    if (name === 'next') {
      const newOffset = offset + 15
      if (newOffset >= currenciesData.count) {
        return
      }
      return setOffset(newOffset)
    }

    const newOffset = offset - 15
    if (newOffset < 0) {
      return
    }
    return setOffset(newOffset)
  }

  const handleChange = (e) => {
    const { currencyCode } = e.target.dataset
    const newState = [...params]
    const idx = newState.indexOf(currencyCode)
    if (idx !== -1) {
      newState.splice(idx, 1)
    } else {
      newState.push(currencyCode)
    }
    return setParams(newState)
  }

  const handleSubmit = () => {
    if (updateStoreIsFetching) {
      return
    }
    updateStore(storeData.id, { currencies: params })
  }

  if (storeData && currenciesData) {
    const currencies = []
    for (let i = 0, len = currenciesData.items.length; i < len; i++) {
      const code = currenciesData.items[i].code
      const translatedName = translator.formatName(code.trim(), { type: 'currency' })
      const selected = params.includes(code)
      currencies.push(
        <Currency
          key={code}
          code={code}
          defaultCurrencyCode={storeData.defaultCurrencyCode}
          translatedName={translatedName}
          value={selected}
          handleChange={handleChange}
        />)
    }

    return (
      <dialog ref={modalRef}>
        <div>
          <button onClick={handleClose}>x</button>
        </div>
        <div>
          <div>{currencies}</div>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={updateStoreIsFetching}
          >{t('apply')}
          </button>
          <div>count: {currenciesData.count}</div>

          current page: {currentPage(currenciesData.offset, currenciesData.fetch)}
          <button
            type='button'
            name='previous'
            onClick={handlePagination}
            disabled={currenciesIsFetching}
          >previous
          </button>
          <button
            type='button'
            name='next'
            onClick={handlePagination}
            disabled={currenciesIsFetching}
          >next
          </button>
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
            <div>
              <span>{t('description')}</span>
            </div>
            <Button $variant='primary' onClick={handleOpenModal}>{t('edit')}</Button>
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
