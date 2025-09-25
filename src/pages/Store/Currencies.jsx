import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import Switch from '../../components/Switch'
import {
  useCurrencies,
  useStore,
  useStoreUpdateMutation,
  useUpdateCurrencyMutation
} from '../../data'
import { currentPage, totalPages } from '../../utils'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import ModalDefault from '../../components/Modals/ModalDefault'
import ModalHeader from '../../components/Modals/ModalHeader'
import ModalBody from '../../components/Modals/ModalBody'
import CardDefault from '../../components/Cards/CardDefault'
import CardHeader from '../../components/Cards/CardHeader'

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
  const fetchAmount = 25
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
  } = useCurrencies({ offset, fetch: fetchAmount })
  const [updateStore, {
    data: updateStoreData,
    isFetching: updateStoreIsFetching,
    error: updateStoreError
  }] = useStoreUpdateMutation()

  useEffect(() => {
    if (!storeData) {
      return
    }

    const { currencies } = storeData.store
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
      const newOffset = offset + fetchAmount
      if (newOffset >= currenciesData.count) {
        return
      }
      return setOffset(newOffset)
    }

    const newOffset = offset - fetchAmount
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
    const { id } = storeData.store
    updateStore(id, { currency_codes: params })
  }

  if (storeData && currenciesData) {
    const { currencies } = currenciesData
    const currenciesList = []
    for (let i = 0, len = currencies.length; i < len; i++) {
      const code = currencies[i].code
      const translatedName = translator.formatName(code.trim(), { type: 'currency' })
      const selected = params.includes(code)
      currenciesList.push(
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
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleClose} />

        <ModalBody>
          <div>{currenciesList}</div>

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
        </ModalBody>

      </ModalDefault>
    )
  }
})

const Currencies = component(() => {
  const { t } = useTranslation('currencies')

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} subtitle={t('description')}>
        <PrimaryButton onClick={handleOpenModal}>{t('edit')}</PrimaryButton>
      </CardHeader>
      <Modal modalRef={modalRef} />
      <StoreCurrencies />
    </CardDefault>
  )
})

export default Currencies
