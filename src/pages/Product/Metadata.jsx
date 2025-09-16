import { component, detectIsUndefined, keys, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import { useProductById } from '../../data'

const MetadataMap = component(({ productId }) => {
  const { data: productData } = useProductById(productId)

  if (productData) {
    const { product } = productData
    const { metadata } = product
    const rows = []

    // TODO is metadata already an object or needs json.parse? Verify
    if (!detectIsUndefined(metadata)) {
      const metadataKeys = keys(metadata)
      for (let i = 0, len = metadataKeys.length; i < len; i++) {
        const key = metadataKeys[i]
        const value = metadata[key]
        rows.push(
          <li>
            <span>{key}</span>
            <span>{value}</span>
            {/* // TODO button to delete key/value pair  */}
          </li>
        )
      }
    }

    return (
      <ul>
        {rows}
        {/* // TODO display current metadata
      // TODO button to add new key/value pair
      // */}
      </ul>
    )
  }
})

const Metadata = component(() => {
  const { t } = useTranslation('product.metadata')
  const params = useParams()
  const productId = params.get('id')

  return (
    <Card>
      <Card.Header title={t('title')} />
      <MetadataMap productId={productId} />
    </Card>
  )
})

export default Metadata
