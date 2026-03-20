import { component, detectIsArray } from '@dark-engine/core'
import { Link, useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductVariantUpdateMutation } from '../../data'
import { formatLine } from '../../utils'
import ButtonMore from '../../components/buttons/ButtonMore'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import Prices from './Prices'

const VariantRowInventory = component(({ manageInventory, inventoryQuantity }) => {
  const { t } = useTranslation('product.variantRowInventory')
  if (manageInventory) {
    return inventoryQuantity
  }
  return t('unmanaged')
})

const VariantDeleteButton = ({ productId, variantId, slot }) => {
  const [deleteVariant, { isFetching }] = useProductVariantUpdateMutation(productId, variantId)

  const handleDelete = () => {
    deleteVariant(variantId)
  }

  return <button type='button' onClick={handleDelete} disabled={isFetching}>{slot}</button>
}

const VariantRow = component(({ productId, variant }) => {
  const { t } = useTranslation('product.variants.row')
  const { id, title, inventoryQuantity, inventoryItem } = variant
  const { manageInventory } = inventoryItem

  return (
    <tr>
      <td>{formatLine(title)}</td>
      <td>
        <VariantRowInventory
          manageInventory={manageInventory}
          inventoryQuantity={inventoryQuantity}
        />
      </td>
      <td>
        <ButtonMore>
          <li>
            <Link to={`/products/${productId}/variants/${id}`}>
              <button type='button'>{t('edit')}</button>
            </Link>
          </li>

          <li>
            <button>{t('manageInventory')}</button>
          </li>

          <li>
            <VariantDeleteButton
              productId={productId}
              variantId={id}
            >{t('delete')}
            </VariantDeleteButton>
          </li>

        </ButtonMore>
      </td>
    </tr>
  )
})

const StyledTable = styled.table`
  width: 100%;
`

const StyledThead = styled.thead`
  border-bottom: 1px solid ${(p) => p.theme.neutral20};
`

const StyledTh = styled.th`
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-weight: unset;
  text-align: unset;
`

// TODO show which option values each variant has
const VariantsTable = component(({ productId }) => {
  const { data: productData } = useProductById(productId)
  const { t } = useTranslation('product.variants.table')

  if (productData) {
    const { variants } = productData.product
    const rows = []
    if (detectIsArray(variants)) {
      for (let i = 0, len = variants.length; i < len; i++) {
        const variant = variants[i]
        rows.push(<VariantRow key={variant.id} productId={productId} variant={variant} />)
      }
    }

    return (
      <StyledTable>
        <StyledThead>
          <StyledTh>{t('title')}</StyledTh>
          <StyledTh>{t('inventory')}</StyledTh>
          <StyledTh>{t('actions')}</StyledTh>
        </StyledThead>
        <tbody>
          {rows}
        </tbody>
      </StyledTable>
    )
  }

  return null
})

// peony guarantees that a product always has at least one variant.
// TODO show different UI if product has only one variant. Not every shop uses variants, those shops shouldn't be concerned with them.
// TODO drag and drop rows to set rank.
const Variants = component(() => {
  const { t } = useTranslation('product.variants')
  const params = useParams()
  const productId = params.get('productId')
  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <ButtonMore type='button'>
          <li>
            <Link to={`/products/${productId}/variants/new`}>
              <button type='button'>{t('create')}</button>
            </Link>
          </li>
          <li><Prices productId={productId} /></li>
        </ButtonMore>
      </CardHeader>

      <VariantsTable productId={productId} />
    </CardDefault>
  )
})

export default Variants
