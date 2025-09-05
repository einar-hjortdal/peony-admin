import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import { useProductById } from '../../data'

const SalesChannels = component(() => {
  const { t } = useTranslation('product.salesChannels')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  if (productData) {
    const { salesChannels } = productData.product
    return (
      <Card>
        <Card.Header title={t('title')} />
        {JSON.stringify(salesChannels)}
        {/* TODO ul sales channel */}
        {/* available in x out of y sales channels */}
      </Card>
    )
  }

  return false
})

export default SalesChannels
