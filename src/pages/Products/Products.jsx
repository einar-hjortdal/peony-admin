import { component, useState } from '@dark-engine/core'
import { Link } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { constants, useProducts, useStore } from '../../data'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import SetTitle from '../../components/SetTitle'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import Table from './Table'
import If from '../../components/If'

const Products = component(() => {
  // TODO implement filters
  const [params, setParams] = useState({
    status: null,
    collection_id: null,
    title: null,
    offset: null,
    fetch: 15,
    order: constants.orderDesc
  })

  const { data: storeData } = useStore()
  const { data: productsData } = useProducts(params)
  // TODO show skeleton while fetching
  // TODO show error message

  const { t } = useTranslation('products')
  // keep state to build request query params
  // no sort, just filter (this simplifies a great deal)
  if (productsData && storeData) {
    const { products } = productsData
    const { defaultLocaleId } = storeData.store

    return (
      <>
        <SetTitle title={t('title')} />
        <CardDefault>
          <CardHeader title={t('title')}>
            <Link to='/products/new'>
              <PrimaryButton type='button'>{t('add')}</PrimaryButton>
            </Link>
          </CardHeader>

          <If condition={products.length === 0}>
            <span>{t('noProducts')}</span>
          </If>

          <If condition={products.length > 0}>
            {/* TODO change to Table.Title */}
            <Table products={products} defaultLocaleId={defaultLocaleId} />
          </If>
        </CardDefault>
      </>
    )
  }
})

export default Products
