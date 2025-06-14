import { component, useMemo } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'

// links: 'edit', 'publish/unpublish', 'duplicate', 'delete'

const Products = component(() => {
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
