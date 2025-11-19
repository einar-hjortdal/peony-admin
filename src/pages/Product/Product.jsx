import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductDeleteMutation, useProductUpdateMutation } from '../../data'
import { formatLine } from '../../utils'
import SetTitle from '../../components/SetTitle'
import If from '../../components/If'
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
import Options from './Options'
import Status from '../../components/products/Status'
import MetadataCard from '../../components/MetadataCard'

const Delete = component(({ productId, slot }) => {
  const [deleteProduct] = useProductDeleteMutation(productId)

  const handleDelete = () => {
    deleteProduct()
  }

  return <button type='button' onClick={handleDelete}>{slot}</button>
})

const StyledUl = styled.ul`
  & li {
    padding-top: .75rem;
    padding-bottom: .75rem;
    border-bottom: 1px solid ${(p) => p.theme.neutral20};
  }
`

const Column = styled.div`
  display: inline-block;
  width: 50%;
`

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

  const handleMetadataChange = (newMetadata) => {
    updateProduct({ metadata: newMetadata })
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
      images,
      metadata
    } = productData.product

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

            <StyledUl>
              <li>
                <Column>{t('general.title')}</Column>
                <Column>{formatLine(title)}</Column>
              </li>

              <li>
                <Column>{t('general.subtitle')}</Column>
                <Column>{formatLine(subtitle)}</Column>
              </li>

              {/* TODO description may be long. Trim if longer than x, display on click? */}
              <li>
                <Column>{t('general.description')}</Column>
                <Column>{formatLine(description)}</Column>
              </li>

              <li>
                <Column>{t('general.handle')}</Column>
                <Column>{handle}</Column>
              </li>

              <li>
                <Column>{t('general.discountable')}</Column>
                <Column>
                  <If condition={discountable}>
                    {t('general.true')}
                  </If>
                  <If condition={!discountable}>
                    {t('general.false')}
                  </If>
                </Column>
              </li>

              {/* <li>
              {t('type')}
            </li> */}
            </StyledUl>

          </CardDefault>
          {/* TODO display translations without clogging */}

          <Translations />
          <Images images={images} onChange={handleImagesChange} />
          <Options />
          <Variants />

          <MetadataCard
            metadata={metadata}
            onChange={handleMetadataChange}
            disabled={updateProductIsFetching}
          />
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
