import {
  component,
  detectIsEmpty,
  detectIsNull,
  detectIsUndefined,
  keys,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'

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

const TableCell = memo(component(({ value, onChange }) => {
  const handleValueChange = useCallback((v) => {
    console.log(v)
  }, [onChange])

  return (
    <CurrencyInput
      placeholder='-'
      value={value}
      onValueChange={handleValueChange}
      allowNegativeValue={false}
    />
  )
}))

const EditPrices = component(({ productId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('editPrices')
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

  // build a map that contains objects with variant id keys
  // each object should have keys of either currencyCode or regionId and the data required for the submission.
  // TODO problem to solve:
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
            minQuantity, // if defined, must be in repsonse object or price will be deleted
            maxQuantity // if defined, must be in repsonse object or price will be deleted
          }
        } else {
          m[variant.id][regionId] = {
            regionId,
            id,
            amount,
            minQuantity, // if defined, must be in repsonse object or price will be deleted
            maxQuantity // if defined, must be in repsonse object or price will be deleted
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
          currencyCode,
          amount
        }
      }))
    } else {
      return setPrices(prev => ({
        ...prev,
        [variantId]: {
          regionId,
          amount
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
    const { currencies } = storeData
    const { items: regions } = regionsData
    const { variants } = productData

    const rows = []
    for (let i = 0, len = variants.length; i < len; i++) {
      const variant = variants[i]
      const ins = [] // TableCell for each currency and region available. Store state

      rows.push(
        <tr>
          <td>{formatLine(variant.title)}</td>
          {ins}
        </tr>
      )
    }

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
                  <thead>
                    <th>variant</th>
                    {/* TODO columns to toggle start (for currency in currencies, for region in regions) */}
                    {/* TODO if region or currency has tax-inclusive prices, display tax-inclusive pricing in heading */}
                    <th>price in currency</th>
                    <th>price in currency (region name)</th>
                    {/* TODO columns to toggle end */}
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
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
