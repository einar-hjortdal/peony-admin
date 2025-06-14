import { component, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'
import { useProducts } from '../data'

// links: 'edit', 'publish/unpublish', 'duplicate', 'delete'

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
    fetch: 15
    // order: null
  })
  const { data, error, isFetching } = useProducts(params)

  const { t } = useTranslation('products')
  // keep state to build request query params
  // no sort, just filter (this simplifies a great deal)
  const headings = [
    t('name'),
    t('collection'),
    t('status'),
    t('availability'),
    t('inventory')
  ]

  return (
    <Card>
      <Card.Header>
        <Card.HeaderTitle>{t('title')}</Card.HeaderTitle>
        <Card.HeaderFilter />
        <Card.HeaderAdd />
      </Card.Header>
      <Card.Table
        headings={headings}
      >
        table
        <Card.TableFooter />
      </Card.Table>
    </Card>
  )
})

export default Products
