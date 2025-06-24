import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'

import { useProductById } from '../data'

const Product = component(() => {
  const params = useParams()
  const productId = params.get('id')
  const { data, isFetching, error } = useProductById(productId)
  if (data) {
    return JSON.stringify(data)
  }
  return null
})

export default Product
