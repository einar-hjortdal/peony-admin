import { component } from '@dark-engine/core'

import { useProductUpdateMutation } from '../../data'
import SEOUpdateCard from '../../components/SEO/SEOUpdateCard'

const ProductSEO = component(({ productId, handle, onHandleChange, seo }) => {
  const [
    updateProduct,
    { isFetching: updateProductIsFetching }
  ] = useProductUpdateMutation(productId)

  const handleHandleChange = (newHandle) => {
    onHandleChange(newHandle)
  }

  const handleSEOChange = (newSEOdata) => {
    updateProduct({ seo: newSEOdata })
  }

  return (
    <SEOUpdateCard
      productId={productId}
      handle={handle}
      onHandleChange={handleHandleChange}
      seo={seo}
      onSEOChange={handleSEOChange}
      disabled={updateProductIsFetching}
    />
  )
})

export default ProductSEO
