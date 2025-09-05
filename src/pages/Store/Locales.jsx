import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import Button from '../../components/Button'
import {
  useLocales,
  useStore,
  useStoreUpdateMutation
} from '../../data'
import { currentPage, totalPages } from '../../utils'

const LocalesTable = styled.table`
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

const StoreLocales = component(() => {
  const { t, translator } = useTranslation('locales.storeLocales')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  // TODO when storeIsFetching show skeleton
  if (storeData) {
    const { locales } = storeData.store
    const rows = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const { code } = locales[i]
      const translatedName = translator.formatName(code, { type: 'language' })
      rows.push(
        <tr>
          <td>
            {code}
            <span>{translatedName}</span>
          </td>
        </tr>
      )
    }

    return (
      <LocalesTable>
        <thead>
          <tr>
            <th>{t('locale')}</th>
            <th>{t('name')}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </LocalesTable>
    )
  }
})

const DefaultLocaleSelect = styled.select`
  display: block;
  width: 100%;
`

const DefaultLocale = component(() => {
  const { t } = useTranslation('locales.defaultLocale')
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
    updateStore(storeData.store.id, { defaultLocaleId: value })
  }

  if (storeData) {
    const { locales, defaultLocaleId } = storeData.store
    const options = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const { id, code } = locales[i]
      options.push(
        <option
          key={id}
          value={id}
          selected={defaultLocaleId === id}
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
          <DefaultLocaleSelect
            title={t('title')}
            name={t('title')}
            onChange={handleChange}
            disabled={updateStoreIsFetching}
          >{options}
          </DefaultLocaleSelect>
        </label>
      </div>
    )
  }
})

const Locale = component(({ locale, defaultLocaleId, translatedName, value, handleChange }) => {
  const { id, code } = locale

  return (
    <div>
      {code} ({translatedName})
      <input
        type='checkbox'
        value={value}
        data-locale-id={id}
        onChange={handleChange}
        disabled={id === defaultLocaleId}
      />
    </div>
  )
})

const Modal = component(({ modalRef }) => {
  const { t, translator } = useTranslation('locales.modal')
  const [offset, setOffset] = useState(0)
  const [params, setParams] = useState([])
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()
  const {
    data: localesData,
    isFetching: localesIsFetching,
    error: localesError
  } = useLocales({ offset, fetch: 20 })
  const [updateStore, {
    data: updateStoreData,
    isFetching: updateStoreIsFetching,
    error: updateStoreError
  }] = useStoreUpdateMutation()

  useEffect(() => {
    if (!storeData) {
      return
    }

    const { locales } = storeData.store
    const newState = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      newState.push(locale.id)
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
    if (localesIsFetching) {
      return
    }

    const { name } = e.target
    if (name === 'next') {
      const newOffset = offset + 15
      if (newOffset >= localesData.count) {
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
    const { localeId } = e.target.dataset
    const newState = [...params]
    const idx = newState.indexOf(localeId)
    if (idx !== -1) {
      newState.splice(idx, 1)
    } else {
      newState.push(localeId)
    }
    return setParams(newState)
  }

  const handleSubmit = () => {
    if (updateStoreIsFetching) {
      return
    }
    updateStore(storeData.store.id, { locale_ids: params })
  }

  if (storeData && localesData) {
    const { locales } = localesData
    const localesList = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      const { id, code } = locale
      const translatedName = translator.formatName(code.trim(), { type: 'language' })
      const value = params.includes(id)
      localesList.push(
        <Locale
          key={id}
          locale={locale}
          defaultLocaleId={storeData.store.defaultLocaleId}
          translatedName={translatedName}
          value={value}
          handleChange={handleChange}
        />)
    }

    return (
      <dialog ref={modalRef}>
        <div>
          <button onClick={handleClose}>x</button>
        </div>
        <div>
          <div>{localesList}</div>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={updateStoreIsFetching}
          >{t('apply')}
          </button>
          <div>count: {localesData.count}</div>

          current page: {currentPage(localesData.offset, localesData.fetch)}
          <button
            type='button'
            name='previous'
            onClick={handlePagination}
            disabled={localesIsFetching}
          >previous
          </button>
          <button
            type='button'
            name='next'
            onClick={handlePagination}
            disabled={localesIsFetching}
          >next
          </button>
          total pages: {totalPages(localesData.count, localesData.fetch)}
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

const Locales = component(() => {
  const { t } = useTranslation('locales')
  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  return (
    <>
      <ColumnLarge>
        <Card>
          <CardTitle>{t('title')}</CardTitle>
          <div>
            <span>{t('description')}</span>
          </div>
          <Button $variant='primary' onClick={handleOpenModal}>{t('edit')}</Button>
          <StoreLocales />
        </Card>
      </ColumnLarge>
      <ColumnSmall>
        <Card>
          <DefaultLocale />
        </Card>
      </ColumnSmall>
      <Modal modalRef={modalRef} />
    </>
  )
})

export default Locales
