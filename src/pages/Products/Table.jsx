import { component, detectIsEmpty } from '@dark-engine/core'
import { Link } from '@dark-engine/web-router'
import { Translate, useTranslation } from '@wareme/translations'

import { getDefaultTranslation } from '../../translations'
import { valueOrDefault } from '../../utils'
import {
  constants,
  useDeleteProductMutation,
  useUpdateProductMutation
} from '../../data'
import If from '../../components/If'
import { styled } from '@dark-engine/styled'

const Actions = component(({ product }) => {
  const { id, status } = product
  const { t } = useTranslation('products.actions')
  const [updateProduct, {
    data: updateProductData,
    isFetching: updateProductIsFetching,
    error: updateProductError
  }] = useUpdateProductMutation(id)
  const [deleteProduct, {
    data: deleteProductData,
    isFetching: deleteProductIsFetching,
    error: deleteProductError
  }] = useDeleteProductMutation(id)

  const handleChangeStatus = (e) => {
    const { newStatus } = e.target.dataset
    updateProduct({ ...product, status: newStatus })
  }

  const handleDelete = () => {
    deleteProduct()
  }

  return (
    <div>
      <ul>
        <li><Link to={`/product/${id}`}>{t('edit')}</Link></li>
        <If condition={status === constants.statusDraft}>
          <li>
            <button
              type='button'
              data-new-status={constants.statusPublished}
              onClick={handleChangeStatus}
            >{t('publish')}
            </button>
          </li>
        </If>
        <If condition={status === constants.statusPublished}>
          <li>
            <button
              type='button'
              data-new-status={constants.statusDraft}
              onClick={handleChangeStatus}
            >{t('unpublish')}
            </button>
          </li>
        </If>
        <li>
          <button type='button' name='delete' onClick={handleDelete}>{t('delete')}</button>
        </li>
      </ul>
    </div>
  )
})

const StyledTable = styled.table`
  width: 100%;
  border-spacing: unset;
  & thead {
    border: unset;
    background-color: ${p => p.theme.disabled};
  }
  & thead tr th,
  & tbody tr td {
    padding-top: .875rem;
    padding-right: .7rem;
    padding-bottom:.875rem;
    padding-left: .7rem;
  }
  & thead tr th {
    text-align: unset;
    border-left: 1px solid ${p => p.theme.borderColor};
    border-right: 1px solid ${p => p.theme.borderColor};
  }
  & thead tr th:first-child{
    border-left: unset;
  }
  & thead tr th:last-child{
    border-right: unset;
  }
`

const StyledSpan = styled.span`
  background-color: ${p => p.theme.disabled};
  padding-top: .4375rem;
  padding-right: .35rem;
  padding-bottom:.4375rem;
  padding-left: .35rem;
  border-radius: .4rem;
`

const Inventory = component(({ variants }) => {
  const len = variants.length
  if (len === 0) {
    return '-'
  }

  let count = 0
  for (let i = 0; i < len; i++) {
    const variant = variants[i]
    const { inventoryQuantity } = variant
    count += inventoryQuantity
  }

  return (
    <Translate
      id='products.table.inventory.content'
      values={{
        quantity: count,
        variants: len
      }}
    />
  )
})

const Table = component(({ products, defaultLocaleId }) => {
  // TODO get collections
  const { t } = useTranslation('products.table')

  const rows = []
  for (let i = 0, len = products.length; i < len; i++) {
    const product = products[i]
    const { id, translations, collectionId, salesChannels, variants } = product
    // TODO match collectionId to collection.translations title

    const defaultTranslation = getDefaultTranslation(translations, defaultLocaleId)
    let title = product.id
    if (!detectIsEmpty(defaultTranslation)) {
      title = valueOrDefault(defaultTranslation.title, product.id)
    }

    const sc = []
    for (let i = 0, len = salesChannels.length; i < len; i++) {
      const salesChannel = salesChannels[i]
      sc.push(<StyledSpan key={salesChannel.id}>{salesChannel.name}</StyledSpan>)
    }

    rows.push(
      <tr key={product.id}>
        <td><Link to={`/product/${id}`}>{title}</Link></td>
        <td>-</td>{/* TODO collection */}
        <td>{product.status}</td>
        <td>{sc}</td>
        <td><Inventory variants={variants} /></td>
        <td><Actions product={product} /></td>
      </tr>)
  }

  return (
    <StyledTable>
      {/* <Filter /> */}
      <thead>
        <tr>
          <th>{t('name')}</th>
          <th>{t('collection')}</th>
          <th>{t('status')}</th>
          <th>{t('availability')}</th>
          <th>{t('inventory')}</th>
          <th>{t('actions')}</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
      {/* <Table.Footer /> */}
    </StyledTable>
  )
})

export default Table
