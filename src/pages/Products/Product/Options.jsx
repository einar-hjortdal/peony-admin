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

const Options = component(() => {
  const params = useParams()
  const productId = params.get('id')
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
      optionChanged,
      optionDeleted,
      optionValueCreated,
      optionValueChanged,
      optionValueDeleted
    } = data
    if (optionCreated) {
      // TODO
      console.log(optionCreated)
    }

    if (optionChanged) {
      // TODO
      console.log(optionChanged)
    }

    if (optionDeleted) {
      // TODO
      console.log(optionDeleted)
    }

    if (optionValueCreated) {
      // TODO
      console.log(optionValueCreated)
    }

    if (optionValueChanged) {
      // TODO
      console.log(optionValueChanged)
    }

    if (optionValueDeleted) {
      // TODO
      console.log(optionValueDeleted)
    }
  }

  if (productData) {
    const { options } = productData.product
    return <ProductOptions options={options} onChange={handleChange} />
  }
})

export default Options
