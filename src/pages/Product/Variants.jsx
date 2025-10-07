import { component, detectIsArray } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductById, useDeleteVariantMutation } from '../../data'
import { formatLine } from '../../utils'
import VariantAdd from './VariantAdd'
import EditPrices from './EditPrices'
import VariantEdit from './VariantEdit'
import ButtonMore from '../../components/Buttons/ButtonMore'
import CardDefault from '../../components/Cards/CardDefault'
import CardHeader from '../../components/Cards/CardHeader'

const VariantRowInventory = component(({ manageInventory, inventoryQuantity }) => {
  const { t } = useTranslation('product.variantRowInventory')
  if (manageInventory) {
    return inventoryQuantity
  }
  return t('unmanaged')
})

const VariantDeleteButton = ({ productId, variantId, slot }) => {
  const [deleteVariant, { isFetching }] = useDeleteVariantMutation(productId)

  const handleDelete = () => {
    deleteVariant(variantId)
  }

  return <button type='button' onClick={handleDelete} disabled={isFetching}>{slot}</button>
}

const VariantRow = component(({ productId, variant }) => {
  const { t } = useTranslation('product.variants.row')
  const { id, title, ean, upc, inventoryQuantity, inventoryItem } = variant
  const { manageInventory } = inventoryItem

  return (
    <tr>
      <td>{formatLine(title)}</td>
      <td>{formatLine(ean)}</td>
      <td>{formatLine(upc)}</td>
      <td>
        <VariantRowInventory
          manageInventory={manageInventory}
          inventoryQuantity={inventoryQuantity}
        />
      </td>
      <td>
        <ButtonMore>
          <li><VariantEdit productId={productId} variant={variant} /></li>
          <li><button>manage inventory</button></li>
          <li><button>duplicate variant</button></li>
          <li>
            <VariantDeleteButton
              productId={productId}
              variantId={id}
            >{t('delete')}
            </VariantDeleteButton>
          </li>

        </ButtonMore>
        {/* TODO dialog */}
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
          <StyledTh>{t('ean')}</StyledTh>
          <StyledTh>{t('upc')}</StyledTh>
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

// peony should guarantee that a product always has at least one variant.
const Variants = component(() => {
  const { t } = useTranslation('product.variants')
  const params = useParams()
  const productId = params.get('id')
  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <ButtonMore type='button'>
          <li><VariantAdd productId={productId} /></li>
          <li><EditPrices productId={productId} /></li>
        </ButtonMore>
      </CardHeader>

      <VariantsTable productId={productId} />
    </CardDefault>
  )
})

export default Variants
