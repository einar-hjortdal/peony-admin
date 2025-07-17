import {
  component,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsUndefined,
  keys,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'
import { nisha } from '@wareme/utils'

import {
  useStore,
  useProductById,
  // useUpdateProductMutation,
  useRegions,
  useUpdateVariantsMutation
} from '../../data'
import { formatLine } from './utils'
import If from '../../components/If'

// handles simple pricing: no quantity-based prices.
// complex pricing needs a less "convenient" layout, it should be an alternative not a replacement.

const TableHeaderName = styled.span`
  display: inline-block;
`

const TableHeaderIncludesTax = styled.span`
  display: inline-block;
  visibility: ${p => nisha(p.$includesTax, 'visible', 'hidden')};
`

const TableHeader = component(({ name, includesTax }) => {
  const { t } = useTranslation('product.editPrices.tableHeader')
  return (
    <th>
      <TableHeaderName>
        {name}
      </TableHeaderName>
      <TableHeaderIncludesTax $includesTax={includesTax}>
        {t('includesTax')}
      </TableHeaderIncludesTax>
    </th>
  )
})

const TableHead = component(({ currencyColumns, regionColumns }) => {
  const { t } = useTranslation('product.editPrices.tableHead')
  const cc = []
  for (let i = 0, len = currencyColumns.length; i < len; i++) {
    const currency = currencyColumns[i]
    const { code, includesTax } = currency
    cc.push(<TableHeader key={code} name={code} includesTax={includesTax} />)
  }

  const rc = []
  for (let i = 0, len = regionColumns.length; i < len; i++) {
    const region = regionColumns[i]
    const { id, name, includesTax } = region
    rc.push(<TableHead key={id} name={name} includesTax={includesTax} />)
  }

  return (
    <thead>
      <th>{t('variant')}</th>
      {cc}
      {rc}
    </thead>
  )
})

// TODO debug CurrencyInput not respecting value
const TableCell = component(({ value, handler }) => {
  console.log(value)
  const handleOnValueChange = (v) => {
    return handler(v)
  }

  return (
    <CurrencyInput
      value={value}
      onValueChange={handleOnValueChange}
      allowNegativeValue={false}
    />
  )
})

const TableBody = ({ variants, prices, currencyColumns, regionColumns, handleInput }) => {
  if (detectIsUndefined(prices)) {
    return false
  }

  const rows = []
  for (let i = 0, len = variants.length; i < len; i++) {
    const variant = variants[i]
    const variantPrices = prices[variant.id]
    const cc = []
    for (let k = 0, len = currencyColumns.length; k < len; k++) {
      const currency = currencyColumns[k]
      let value
      if (detectIsObject(variantPrices)) {
        const currencyPrice = variantPrices[currency.code]
        if (detectIsObject(currencyPrice)) {
          value = currencyPrice.amount
        }
      }
      cc.push(
        <TableCell
          key={`${variant.id}-${currency.code}`}
          value={value}
          handler={(amount) => handleInput(variant.id, amount, currency.code)}
        />
      )
    }

    const rc = []
    for (let k = 0, len = regionColumns.length; k < len; k++) {
      const region = regionColumns[k]
      let value
      if (detectIsObject(variantPrices)) {
        const regionPrice = variantPrices[region.id] // may be undef
        if (detectIsObject(regionPrice)) {
          value = regionPrice.amount
        }
      }
      rc.push(
        <TableCell
          key={`${variant.id}-${region.id}`}
          value={value}
          handler={(amount) => handleInput(variant.id, amount, region.currencyCode, region.id)}
        />
      )
    }

    rows.push(
      <tr key={variant.id}>
        <td>{formatLine(variant.title)}</td>
        {cc}
        {rc}
      </tr>
    )
  }

  return (
    <tbody>
      {rows}
    </tbody>
  )
}

const EditPrices = component(({ productId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('product.editPrices')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError,
    translationsObject: productTranslationsObject
  } = useProductById(productId)

  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  const {
    data: regionsData,
    isFetching: regionsIsFetching,
    error: regionsError
  } = useRegions()

  const [updateVariants, {
    data: updateVariantsData,
    isFetching: updateVariantsIsFetching,
    error: updateVarianstError
  }] = useUpdateVariantsMutation(productId)

  // TODO create state variables from storeData.currencies and regionsData.items
  const [currencyColumns, setCurrencyColumns] = useState([])
  const [regionColumns, setRegionColumns] = useState([])
  useEffect(() => {
    if (detectIsEmpty(storeData) || detectIsEmpty(regionsData)) {
      return
    }

    const { currencies } = storeData
    const regions = regionsData.items

    const newCurrencyColumns = [...currencies].sort((a, b) => {
      if (a.code < b.code) return -1
      if (a.code > b.code) return 1
      return 0
    })

    const newRegionColumns = [...regions].sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    setCurrencyColumns(newCurrencyColumns)
    setRegionColumns(newRegionColumns)
  }, [storeData, regionsData])

  // build a map that contains objects with variant id keys
  // each object should have keys of either currencyCode or regionId and the data required for the submission.
  const [prices, setPrices] = useState({})
  useEffect(() => {
    const m = {}
    const { variants } = productData
    if (detectIsUndefined(variants)) {
      return m
    }

    for (let i = 0, len = variants.length; i < len; i++) {
      const variant = variants[i]
      m[variant.id] = {}
      const { moneyAmounts } = variant
      if (detectIsUndefined(moneyAmounts)) {
        continue
      }
      for (let k = 0, len = moneyAmounts.length; k < len; k++) {
        const moneyAmount = moneyAmounts[k]
        const { id, amount, currencyCode, regionId, minQuantity, maxQuantity } = moneyAmount
        if (detectIsUndefined(regionId)) {
          m[variant.id][moneyAmount.currencyCode] = {
            currencyCode,
            id,
            amount,
            minQuantity, // if defined, must be in repsonse object or it will change
            maxQuantity // if defined, must be in repsonse object or it will change
          }
        } else {
          m[variant.id][regionId] = {
            regionId,
            id,
            amount,
            minQuantity, // if defined, must be in repsonse object or it will change
            maxQuantity // if defined, must be in repsonse object or it will change
          }
        }
      }
    }
    setPrices(m)
  }, [productData])

  const handleInput = (variantId, amount, currencyCode, regionId) => {
    if (detectIsEmpty(regionId)) {
      return setPrices(prev => ({
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [currencyCode]: {
            currencyCode,
            amount
          }
        }
      }))
    } else {
      return setPrices(prev => ({
        ...prev,
        [variantId]: {
          ...prev[variantId],
          regionId: {
            regionId,
            amount
          }
        }
      }))
    }
  }

  const modalRef = useRef(null)
  const formRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.close()
  }

  const handleSave = () => {
    const variants = {}
    const variantIds = keys(prices)
    for (let i = 0, len = variantIds.length; i < len; i++) {
      const variantId = variantIds[i]
      const variantPrices = prices[variantId]
      const ids = keys(variantPrices)
      const variantMoneyAmounts = []
      for (let k = 0, len = ids.length; k < len; k++) {
        const id = ids[k]
        const moneyAmount = variantPrices[id]
        variantMoneyAmounts.push(moneyAmount)
      }
      variants[variantId] = { moneyAmounts: variantMoneyAmounts }
    }
    // TODO compare with productData.variants and only submit variants that changed
    console.log(variants)
    // updateVariantsData(variants)
    return handleCloseModal()
  }

  const handleDiscard = (event) => {
    // TODO ask for confirmation before proceeding
    // TODO reset state
    formRef.current.reset()
    console.log('TODO discard')
  }

  if (productData && storeData && regionsData) {
    const { variants } = productData
    return (
      <>
        <button type='button' onClick={handleOpenModal}>edit prices</button>
        <dialog ref={modalRef}>
          {/* TODO x should ask for confirmation if state changed */}
          <button type='button' onClick={handleCloseModal}>x</button>
          <div>
            <div>
              {/* TODO save button should save and then close on success */}
              <button
                type='button'
                onClick={handleSave}
                disabled={productIsFetching || updateVariantsIsFetching}
              >save
              </button>
              <button
                type='button'
                onClick={handleDiscard}
                disabled={productIsFetching || updateVariantsIsFetching}
              >discard changes
              </button>
            </div>
            <div>
              <button type='button'>...</button>
              {/* TODO toggle columns */}
              <If condition={isOpen}>
                <div>
                  <ul>
                    <li>columns to toggle</li>
                  </ul>
                </div>
              </If>
              <form ref={formRef}>
                <table>
                  <caption>{productTranslationsObject[storeData.defaultLocaleId].title}</caption>
                  <TableHead currencyColumns={currencyColumns} regionColumns={regionColumns} />
                  <TableBody
                    variants={variants}
                    prices={prices}
                    currencyColumns={currencyColumns}
                    regionColumns={regionColumns}
                    handleInput={handleInput}
                  />
                </table>
              </form>
            </div>
          </div>
        </dialog>
      </>
    )
  }

  return false
})

export default EditPrices
