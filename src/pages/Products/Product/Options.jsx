import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'

import ProductOptions from '../../../components/products/ProductOptions'
import {
  useProductById,
  useProductOptionCreateMutation,
  useProductOptionDeleteMutation,
  useProductOptionUpdateMutation,
  useProductOptionValueCreateMutation,
  useProductOptionValueDeleteMutation,
  useProductOptionValueUpdateMutation
} from '../../../data'

// TODO make ProductOptions represent server state on every change, not internal state.
const Options = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const { data: productData } = useProductById(productId)
  const [optionCreate] = useProductOptionCreateMutation(productId)
  const [optionUpdate] = useProductOptionUpdateMutation(productId)
  const [optionDelete] = useProductOptionDeleteMutation(productId)
  const [optionValueCreate] = useProductOptionValueCreateMutation(productId)
  const [optionValueUpdate] = useProductOptionValueUpdateMutation(productId)
  const [optionValueDelete] = useProductOptionValueDeleteMutation(productId)

  const handleChange = (data) => {
    const {
      optionCreated,
      optionUpdated,
      optionDeleted,
      optionValueCreated,
      optionValueUpdated,
      optionValueDeleted
    } = data
    if (optionCreated) {
      optionCreate(optionCreated)
    }

    if (optionUpdated) {
      optionUpdate(optionUpdated.id, optionUpdated)
    }

    if (optionDeleted) {
      optionDelete(optionDeleted.id)
    }

    if (optionValueCreated) {
      const { optionId } = optionValueCreated
      optionValueCreate(optionId, optionValueCreated)
    }

    if (optionValueUpdated) {
      const { id, optionId } = optionValueUpdated
      optionValueUpdate(optionId, id, optionValueUpdated)
    }

    if (optionValueDeleted) {
      const { id, optionId } = optionValueDeleted
      optionValueDelete(optionId, id)
    }
  }

  if (productData) {
    const { options } = productData.product
    return <ProductOptions options={options} onChange={handleChange} />
  }
})

export default Options
