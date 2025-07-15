import {
  component,
  detectIsArray,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsString,
  detectIsUndefined,
  keys,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

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

const EditPrices = component(({ productId }) => {
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
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
    modalRef.current.close()
  }

  // save button should save and then close on success
  // discard should just reset table state
  // x should ask for confirmation if state changed

  // toggle visibility of columns using a settings button
  // table first row under headings should show product name and be grayed out
  // one column for each region
  // one column for each currency
  // if region or currency has tax-inclusive prices, display tax-inclusive pricing in heading
  if (productData && storeData && regionsData) {
    const { currencies } = storeData
    const { items: regions } = regionsData
    // need headings of currencies
    // also need headings of regions
    // should make it easy to add cells to the right column somehow

    const { variants } = productData
    const rows = []
    for (let i = 0, len = variants.length; i < len; i++) {
      const variant = variants[i]
      rows.push(
        <tr>
          <td>{formatLine(variant.title)}</td>
          <td>a</td>
          <td>b</td>
        </tr>
      )
    }

    return (
      <>
        <button type='button' onClick={handleOpenModal}>edit prices</button>
        <dialog ref={modalRef}>
          <button type='button' onClick={handleCloseModal}>x</button>
          <div>
            <button type='button'>save</button>
            <button type='button'>discard changes</button>
            <table>
              <thead>
                <th>variant title</th>
                <th>price in currency</th>
                <th>price in currency (region name)</th>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </dialog>
      </>
    )
  }

  return false
})

export default EditPrices
