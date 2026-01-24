import { component } from '@dark-engine/core'

import { useProductSEOUpdateMutation } from '../../data'
import SEOUpdateCard from '../../components/SEO/SEOUpdateCard'

const ProductSEO = component(({ productId, handle, onHandleChange, seo }) => {
  const [
    updateProductSEO,
    { isFetching: updateProductSEOIsFetching }
  ] = useProductSEOUpdateMutation(productId, seo.id)

  const handleHandleChange = (newHandle) => {
    onHandleChange(newHandle)
  }

  const handleSEOChange = (data) => {
    updateProductSEO(data)
  }

  const isDisabled = () => {
    return updateProductSEOIsFetching
  }

  return (
    <SEOUpdateCard
      productId={productId}
      handle={handle}
      onHandleChange={handleHandleChange}
      seo={seo}
      onSEOChange={handleSEOChange}
      disabled={isDisabled()}
    />
  )
})

export default ProductSEO
