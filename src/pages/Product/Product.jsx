import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import {
  useProductById,
  useProductDeleteMutation,
  useProductUpdateMutation
} from '../../data'
import SetTitle from '../../components/SetTitle'
import ColumnLarge from '../../components/columns/ColumnLarge'
import ColumnSmall from '../../components/columns/ColumnSmall'
import Images from '../../components/products/Images'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import ButtonMore from '../../components/buttons/ButtonMore'
import Organize from '../../components/products/Organize/Organize'
import SalesChannels from './SalesChannels'
import Variants from './Variants'
import EditGeneral from './EditGeneral'
import Translations from './Translations'
// import Options from './Options'
import Status from '../../components/products/Status'
import MetadataCard from '../../components/MetadataCard'
import ProductSEO from './ProductSEO'
import KeyValueListPreview from '../../components/products/KeyValueListPreview'

const Delete = component(({ productId, slot }) => {
  const [deleteProduct] = useProductDeleteMutation(productId)

  const handleDelete = () => {
    deleteProduct()
  }

  return <button type='button' onClick={handleDelete}>{slot}</button>
})

const Product = component(() => {
  const { t } = useTranslation('product')
  const params = useParams()
  const productId = params.get('productId')
  const { data: productData } = useProductById(productId)

  const [
    updateProduct,
    { isFetching: updateProductIsFetching }
  ] = useProductUpdateMutation(productId)

  const handleStatusChange = (newStatus) => {
    updateProduct({ status: newStatus })
  }

  const handleImagesChange = (newImages) => {
    updateProduct({ images: newImages })
  }

  const handleThumbnailChange = (newThumbnailIndex) => {
    updateProduct({ thumbnail: newThumbnailIndex })
  }

  const handleMetadataChange = (newMetadata) => {
    updateProduct({ metadata: newMetadata })
  }

  const handleHandleChange = (newHandle) => {
    updateProduct({ handle: newHandle })
  }

  const handleOrganizeChange = (data) => {
    const { categoryIds } = data
    if (categoryIds) {
      return updateProduct({ categoryIds })
    }
  }

  // TODO check for database changes when adding prices
  if (productData) {
    const {
      title,
      subtitle,
      description,
      handle,
      discountable,
      status,
      categoryIds,
      thumbnail,
      images,
      metadata,
      seo
    } = productData.product

    const getDiscountableTranslation = () => {
      if (discountable) {
        return t('general.true')
      }
      t('general.fsle')
    }

    const previewKeys = [
      t('general.title'),
      t('general.subtitle'),
      t('general.description'),
      t('general.discountable')
    ]
    const previewValues =
      [
        title,
        subtitle,
        description,
        getDiscountableTranslation()
      ]

    return (
      <>
        <SetTitle title={t('title')} />
        <ColumnLarge>
          <CardDefault>
            <CardHeader title={t('general')}>
              <ButtonMore>
                <li><EditGeneral /></li>
                <li>
                  <Delete productId={productId}>{t('general.delete')}</Delete>
                </li>
              </ButtonMore>
            </CardHeader>

            <KeyValueListPreview keys={previewKeys} values={previewValues} />

          </CardDefault>

          <Images
            images={images}
            thumbnail={thumbnail}
            onImagesChange={handleImagesChange}
            onThumbnailChange={handleThumbnailChange}
          />
          {/* <Options /> */}
          <Variants />
          <ProductSEO
            productId={productId}
            handle={handle}
            onHandleChange={handleHandleChange}
            seo={seo}
          />

          <MetadataCard
            metadata={metadata}
            onChange={handleMetadataChange}
            disabled={updateProductIsFetching}
          />

          <Translations />
        </ColumnLarge>

        <ColumnSmall>
          <Status defaultValue={status} onChange={handleStatusChange} />

          <SalesChannels />

          <Organize
            categoryIds={categoryIds}
            onChange={handleOrganizeChange}
            disabled={updateProductIsFetching}
          />
        </ColumnSmall>
      </>
    )
  }
})

export default Product
