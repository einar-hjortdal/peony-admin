import { component, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductUpdateMutation } from '../../../data'
import MetadataInputs from '../../../components/MetadataInputs'
import CardDefault from '../../../components/cards/CardDefault'
import CardHeader from '../../../components/cards/CardHeader'

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
      <CardDefault>
        <CardHeader title={t('title')} />
        <MetadataInputs metadata={metadata} onChange={handleChange} />
        <button type='button' onClick={handleUpdate}>update</button>
      </CardDefault>
    )
  }
})

export default Metadata
