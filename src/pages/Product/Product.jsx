import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductDeleteMutation, useProductUpdateMutation } from '../../data'
import { formatLine } from '../../utils'
import { productStatus } from '../../constants'
import Variants from './Variants'
import SetTitle from '../../components/SetTitle'
import If from '../../components/If'
import ColumnLarge from '../../components/Columns/ColumnLarge'
import ColumnSmall from '../../components/Columns/ColumnSmall'
import Organize from './Organize/Organize'
import SalesChannels from './SalesChannels'
import Options from './Options'
import Images from './Images'
import Metadata from './Metadata'
import CardDefault from '../../components/Cards/CardDefault'
import CardHeader from '../../components/Cards/CardHeader'
import BadgeWarning from '../../components/Badges/BadgeWarning'
import BadgeSuccess from '../../components/Badges/BadgeSuccess'
import ButtonMore from '../../components/Buttons/ButtonMore'
import Edit from './Edit'
import Translations from './Translations'
import { styled } from '@dark-engine/styled'

const StatusUpdate = component(({ productId, status, slot }) => {
  const [updateProduct] = useProductUpdateMutation(productId)
  const handlePublish = () => {
    updateProduct({ status })
  }

  return <button type='button' onClick={handlePublish}>{slot}</button>
})

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
  const { t, translator } = useTranslation('product')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  // TODO check for database changes when adding prices
  if (productData) {
    const {
      title,
      subtitle,
      description,
      handle,
      discountable,
      status
    } = productData.product

    return (
      <>
        <SetTitle title={t('title')} />
        <ColumnLarge>
          <CardDefault>
            <CardHeader title={t('general')}>
              <If condition={status === productStatus.draft}>
                <BadgeWarning>{t('general.draft')}</BadgeWarning>
              </If>
              <If condition={status === productStatus.published}>
                <BadgeSuccess>{t('general.published')}</BadgeSuccess>
              </If>

              <ButtonMore>
                <li><Edit /></li>
                <If condition={status === productStatus.draft}>
                  <li>
                    <StatusUpdate
                      productId={productId}
                      status={productStatus.published}
                    >{t('general.publish')}
                    </StatusUpdate>
                  </li>
                </If>
                <If condition={status === productStatus.published}>
                  <li>
                    <StatusUpdate
                      productId={productId}
                      status={productStatus.draft}
                    >{t('general.unpublish')}
                    </StatusUpdate>
                  </li>
                </If>
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

              {/* TODO description may be long. Trim if longer than, display on click? */}
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
          <Images />
          <Options />
          <Variants />
          <Metadata />
        </ColumnLarge>

        <ColumnSmall>
          <SalesChannels />
          <Organize />
          {/* TODO tags */}
          {/* TODO collections */}
        </ColumnSmall>
      </>
    )
  }
})

export default Product
