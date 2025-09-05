import {
  component,
  useState,
  useRef,
  detectIsNull
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { styled } from '@dark-engine/styled'

import Card from '../../components/Card'
import Table from './Table'
import NewProduct from './NewProduct'
import { constants, useProducts, useStore } from '../../data'
import PrimaryButton from '../../components/Buttons/PrimaryButton'

const Products = component(() => {
  // TODO implement filters that are commented out
  const [params, setParams] = useState({
    // id: null,
    // handle: null,
    // is_giftcard: null,
    status: null,
    collection_id: null,
    // type_id: null,
    // tag_id: null,
    title: null,
    // description: null,
    // category_id: null,
    // price_list_id: null,
    // sales_channel_id: null,
    // region_id: null,
    // currency_code: null,
    offset: null,
    fetch: 15,
    order: constants.orderDesc
  })

  const { isFetching: storeIsFetching, data: storeData, error: storeError } = useStore()
  // TODO show skeleton while fetching
  // TODO show error message
  const { data: productsData, error: productsError, isFetching: productsIsFetching } = useProducts(params)

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    modalRef.current.showModal()
  }

  const { t } = useTranslation('products')
  // keep state to build request query params
  // no sort, just filter (this simplifies a great deal)
  if (productsData && storeData) {
    const { products } = productsData
    const { defaultLocaleId } = storeData.store

    return (
      <>
        <Card>
          <Card.Header title={t('title')}>
            <PrimaryButton
              type='button'
              disabled={detectIsNull(modalRef)}
              onClick={handleOpenModal}
            >{t('addProduct')}
            </PrimaryButton>
          </Card.Header>
          {/* TODO change to Table.Title */}
          <Card.Body>
            <Table products={products} defaultLocaleId={defaultLocaleId} />
          </Card.Body>
        </Card>
        <NewProduct modalRef={modalRef} />
      </>
    )
  }
})

export default Products
