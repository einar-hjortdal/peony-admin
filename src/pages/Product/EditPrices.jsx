import {
  component,
  detectIsArray,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsString,
  detectIsUndefined,
  keys,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { CurrencyInput } from '@wareme/currency-input'

import {
  useStore,
  useProductById,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useRegions
} from '../../data'
import Card from '../../components/Card'
import If from '../../components/If'
import { formatLine } from './utils'

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

  const [updateProduct, {
    data: updateProductData,
    isFetching: updateProductIsFetching,
    error: updateProductError
  }] = useUpdateProductMutation(productId)

  const columns = useMemo(() => {
    if (storeData && regionsData) {
      // ???
    }
  }, [storeData, regionsData])

  const existingPricesMap = useMemo(() => {
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
        const { id, amount, currencyCode, regionId } = moneyAmount
        // TODO minQuantity maxQuantity
        if (detectIsUndefined(regionId)) {
          m[variant.id][moneyAmount.currencyCode] = {
            currencyCode,
            id,
            amount
          }
        } else {
          m[variant.id][regionId] = {
            regionId,
            id,
            amount
          }
        }
      }
    }
    return m
  }, [productData])

  const handleInput = () => {

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
    console.log('TODO save')
    // updateProduct()
    // return handleCloseModal()
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
                disabled={productIsFetching || updateProductIsFetching}
              >save
              </button>
              <button
                type='button'
                onClick={handleDiscard}
                disabled={productIsFetching || updateProductIsFetching}
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
