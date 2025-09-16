import { component, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import { useProductById, useProductUpdateMutation } from '../../data'
import MetadataInputs from '../../components/MetadataInputs'

const Metadata = component(() => {
  const { t } = useTranslation('product.metadata')
  const params = useParams()
  const productId = params.get('id')
  const { data: productData } = useProductById(productId)

  const [newMetadata, setNewMetadata] = useState({})
  const [updateProduct] = useProductUpdateMutation(productId)

  const handleChange = (newState) => {
    setNewMetadata(newState)
  }

  const handleUpdate = () => {
    updateProduct({ metadata: newMetadata })
  }

  if (productData) {
    const { metadata } = productData.product
    return (
      <Card>
        <Card.Header title={t('title')} />
        <MetadataInputs metadata={metadata} onChange={handleChange} />
        <button type='button' onClick={handleUpdate}>update</button>
      </Card>
    )
  }
})

export default Metadata
