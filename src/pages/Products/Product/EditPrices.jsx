import {
  component,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsUndefined,
  keys,
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
  useRegions
} from '../../../data'
import { formatLine } from '../../../utils'
import ButtonMore from '../../../components/buttons/ButtonMore'
import ModalDefault from '../../../components/modals/ModalDefault'
import ModalHeader from '../../../components/modals/ModalHeader'

// handles simple pricing: no quantity-based prices.
// quantity-based prices pricing needs a less "convenient" layout.
// such layout should offered as an alternative to the more simple layout (most people likely won't
// need it).

// TODO handle prices individually: save each change onBlur or with save button on each row.

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

const TableCell = component(({ decimalDigits, value, handler }) => {
  const getDecimals = () => {
    if (detectIsUndefined(decimalDigits)) {
      return 0
    }
    return decimalDigits
  }

  const getValue = () => {
    if (detectIsUndefined(value)) {
      return
    }

    if (detectIsUndefined(decimalDigits) || decimalDigits === 0) {
      return value
    }

    return value / (Math.pow(10, decimalDigits))
  }

  const handleOnValueChange = (value) => {
    if (detectIsUndefined(value)) {
      return
    }

    if (detectIsUndefined(decimalDigits) || decimalDigits === 0) {
      return handler(value)
    }

    return handler(Number(value) * Math.pow(10, decimalDigits))
  }

  return (
    <CurrencyInput
      value={getValue()}
      decimalScale={getDecimals()}
      decimalsLimit={getDecimals()}
      onValueChange={handleOnValueChange}
      allowNegativeValue={false}
    />
  )
})

const TableBody = ({ variants, moneyAmounts, currencyColumns, regionColumns, handleInput }) => {
  if (detectIsUndefined(moneyAmounts)) {
    return null
  }

  // TODO max 1 loop variable: split to separate utility function or component
  const rows = []
  for (let i = 0, len = variants.length; i < len; i++) {
    const variant = variants[i]
    const variantPrices = moneyAmounts[variant.id]
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
          decimalDigits={currency.decimalDigits}
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
        const regionPrice = variantPrices[region.id]
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
  const { t } = useTranslation('product.editPrices')
  const {
    data: productData,
    isFetching: productIsFetching,
    translationsObject: productTranslationsObject
  } = useProductById(productId)

  const { data: storeData } = useStore()
  const { data: regionsData } = useRegions()

  const [currencyColumns, setCurrencyColumns] = useState([])
  const [regionColumns, setRegionColumns] = useState([])
  useEffect(() => {
    if (detectIsEmpty(storeData) || detectIsEmpty(regionsData)) {
      return
    }

    const { currencies } = storeData.store
    const regions = regionsData.regions

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
  const getInitialData = () => {
    const m = {}
    const { variants } = productData.product
    if (detectIsUndefined(variants)) {
      return m
    }

    // TODO max 1 loop variable: split to separate utility function or component
    for (let i = 0, len = variants.length; i < len; i++) {
      const variant = variants[i]
      m[variant.id] = {}
      const ma = variant.moneyAmounts
      if (detectIsUndefined(ma)) {
        continue
      }
      for (let k = 0, len = ma.length; k < len; k++) {
        const moneyAmount = ma[k]
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
    return m
  }

  const [moneyAmounts, setMoneyAmounts] = useState({})
  useEffect(() => {
    setMoneyAmounts(getInitialData())
  }, [productData])

  const handleInput = (variantId, amount, currencyCode, regionId) => {
    if (detectIsEmpty(regionId)) {
      return setMoneyAmounts(prev => ({
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
      return setMoneyAmounts(prev => ({
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
    setMoneyAmounts(getInitialData())
    modalRef.current.close()
  }

  const handleSave = async () => {
    // detect changes
    const variantsChanged = []
    const initialData = getInitialData()
    const variantIds = keys(moneyAmounts)
    for (let i = 0, len = variantIds.length; i < len; i++) {
      const variantId = variantIds[i]
      const initialMoneyAmounts = initialData[variantId]
      const currentMoneyAmounts = moneyAmounts[variantId]

      const initialMoneyAmountKeys = keys(initialMoneyAmounts)
      for (let k = 0, len = initialMoneyAmountKeys.length; k < len; k++) {
        const currentKey = initialMoneyAmountKeys[k]
        const currentMoneyAmount = currentMoneyAmounts[currentKey]
        // variant changed if moneyAmount was removed
        if (detectIsUndefined(currentMoneyAmount)) {
          variantsChanged.push(variantId)
          break
        }
      }
      if (variantsChanged[variantsChanged.length - 1] === variantId) {
        continue
      }

      const currentMoneyAmountsKeys = keys(currentMoneyAmounts)
      for (let k = 0, len = currentMoneyAmountsKeys.length; k < len; k++) {
        const currentKey = currentMoneyAmountsKeys[k]
        const initialMoneyAmount = initialMoneyAmounts[currentKey]
        // variant changed if moneyAmount is new
        if (detectIsUndefined(initialMoneyAmount)) {
          variantsChanged.push(variantId)
          break
        }

        const currentMoneyAmount = currentMoneyAmounts[currentKey]
        const initialAmount = initialMoneyAmount.amount
        const currentAmount = currentMoneyAmount.amount
        if (initialAmount !== currentAmount) {
          variantsChanged.push(variantId)
          break
        }
      }
      if (variantsChanged[variantsChanged.length - 1] === variantId) {
        continue
      }
    }

    // early exit
    if (variantsChanged.length === 0) {
      return
    }

    // build updateVariants parameter using changed variants
    const variantsMoneyAmounts = {}
    for (let i = 0, len = variantsChanged.length; i < len; i++) {
      const variantId = variantsChanged[i]
      const variantPrices = moneyAmounts[variantId]
      const ids = keys(variantPrices)
      const variantMoneyAmounts = []
      for (let k = 0, len = ids.length; k < len; k++) {
        const id = ids[k]
        const moneyAmount = variantPrices[id]
        variantMoneyAmounts.push(moneyAmount)
      }
      variantsMoneyAmounts[variantId] = { moneyAmounts: variantMoneyAmounts }
    }

    // await updateVariants(variantsMoneyAmounts)
    console.log(variantsMoneyAmounts)
    return handleCloseModal()
  }

  const handleDiscard = (event) => {
    // TODO ask for confirmation before proceeding
    setMoneyAmounts(getInitialData())
  }

  if (productData && storeData && regionsData) {
    const { variants } = productData.product
    // TODO remove this (peony must guarantee there is always at least one variant per product)
    if (detectIsUndefined(variants)) {
      return null
    }

    return (
      <>
        <button type='button' onClick={handleOpenModal}>edit prices</button>
        <ModalDefault ref={modalRef}>
          {/* TODO x should ask for confirmation if state changed */}
          <ModalHeader title={t('title')} handleClose={handleCloseModal} />
          <div>
            <div>
              {/* TODO save button should save and then close on success */}
              <button
                type='button'
                onClick={handleSave}
                disabled={productIsFetching}
              >save
              </button>
              <button
                type='button'
                onClick={handleDiscard}
                disabled={productIsFetching}
              >discard changes
              </button>
            </div>
            <div>
              <ButtonMore>
                {/* TODO toggle columns */}
                <li>columns to toggle</li>
              </ButtonMore>
              <table>
                <caption>{productTranslationsObject[storeData.store.defaultLocaleId].title}</caption>
                <TableHead currencyColumns={currencyColumns} regionColumns={regionColumns} />
                <TableBody
                  variants={variants}
                  moneyAmounts={moneyAmounts}
                  currencyColumns={currencyColumns}
                  regionColumns={regionColumns}
                  handleInput={handleInput}
                />
              </table>
            </div>
          </div>
        </ModalDefault>
      </>
    )
  }

  return null
})

export default EditPrices
