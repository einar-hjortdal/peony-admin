import { component } from '@dark-engine/core'

import { useProductSEODeleteMutation, useProductSEOUpdateMutation } from '../../data'
import SEOUpdateCard from '../../components/SEO/SEOUpdateCard'

const ProductSEO = component(({ productId, handle, onHandleChange, seo }) => {
  const [
    updateProductSEO,
    { isFetching: updateProductSEOIsFetching }
  ] = useProductSEOUpdateMutation(productId, seo.id)

  const [
    deleteProductSEO,
    { isFetching: deleteProductSEOIsFetching }
  ] = useProductSEODeleteMutation(productId, seo.id)

  const handleHandleChange = (newHandle) => {
    onHandleChange(newHandle)
  }

  const handleSEOChange = (data) => {
    updateProductSEO(data)
  }

  const handleSEODelete = () => {
    deleteProductSEO()
  }

  const isDisabled = () => {
    return updateProductSEOIsFetching || deleteProductSEOIsFetching
  }

  return (
    <SEOUpdateCard
      productId={productId}
      handle={handle}
      onHandleChange={handleHandleChange}
      seo={seo}
      onSEOChange={handleSEOChange}
      onSEODelete={handleSEODelete}
      disabled={isDisabled()}
    />
  )
})

export default ProductSEO
