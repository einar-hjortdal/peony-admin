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

const Product = component(() => {
  const { t, translator } = useTranslation('product')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  // check database changes when adding prices

  // TODO show thumbnail marker on image that is also the thumbnail
  if (productData) {
    const { title, subtitle, description, discountable, status } = productData.product
    return (
      <>
        <SetTitle title={t('details')} />
        <ColumnLarge>
          <CardDefault>
            <CardHeader title={t('details')}>
              <ButtonMore>
                <ul>
                  <li><Edit /></li>
                  <If condition={status === productStatus.draft}>
                    <li>
                      <StatusUpdate
                        productId={productId}
                        status={productStatus.published}
                      >{t('publish')}
                      </StatusUpdate>
                    </li>
                  </If>
                  <If condition={status === productStatus.published}>
                    <li>
                      <StatusUpdate
                        productId={productId}
                        status={productStatus.draft}
                      >{t('unpublish')}
                      </StatusUpdate>
                    </li>
                  </If>
                  <li>
                    <Delete productId={productId}>{t('delete')}</Delete>
                  </li>
                </ul>
              </ButtonMore>
              {/* TODO more button edit, publish/unpublish */}
            </CardHeader>

            {/* TODO display current data */}
            <div>
              {t('title')}: {formatLine(title)}
            </div>

            <div>
              {t('subtitle')}: {formatLine(subtitle)}
            </div>

            {/* TODO description may be long. Trim if longer than, display on click? */}
            <div>
              {t('description')}: {formatLine(description)}
            </div>

            <div>
              {t('status')}:
              <If condition={status === productStatus.draft}>
                <BadgeWarning>{status}</BadgeWarning>
              </If>
              <If condition={status === productStatus.published}>
                <BadgeSuccess>{status}</BadgeSuccess>
              </If>
            </div>

            {/* TODO display translations without clogging */}

            {/* <div>
              {t('type')}
            </div> */}
            <div>
              {t('discountable')}: {String(discountable)}
              {/* TODO */}
            </div>
          </CardDefault>

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
