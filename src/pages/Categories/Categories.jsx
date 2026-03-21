import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useCategories, useCategoryDeleteMutation } from '../../data'
import ButtonMore from '../../components/buttons/ButtonMore'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import SecondaryButton from '../../components/buttons/SecondaryButton'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import { Link } from '@dark-engine/web-router'

const Delete = component(({ id, slot }) => {
  const [deleteCategory, { isFetching }] = useCategoryDeleteMutation(id)

  const handleDelete = () => {
    deleteCategory(id)
  }

  return (
    <button type='text' onClick={handleDelete} disabled={isFetching}>{slot}</button>
  )
})

const StyledTable = styled.table`
  width: 100%;
  border-spacing: unset;
  & thead {
    background-color: ${p => p.theme.neutral10};
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
  }
  & tbody tr {
    border-bottom: ${p => `1px solid ${p.theme.neutral20}`};
  }
`

const Status = component(({ isActive }) => {
  const { t } = useTranslation('categories.status')
  const getStatus = () => {
    if (isActive) {
      return t('active')
    }
    return t('disabled')
  }

  return <span>{getStatus()}</span>
})

const Visibility = component(({ isInternal }) => {
  const { t } = useTranslation('categories.visibility')
  const getVisibility = () => {
    if (isInternal) {
      return t('internal')
    }
    return t('public')
  }

  return <span>{getVisibility()}</span>
})

const Category = component(({ productCategory }) => {
  const { t } = useTranslation('categories.row')
  const { id, handle, isActive, isInternal, name } = productCategory

  return (
    <tr>
      <td>{name}</td>
      <td>{handle}</td>
      <td><Status isActive={isActive} /></td>
      <td><Visibility isInternal={isInternal} /></td>
      <td>
        <ButtonMore>
          <li>
            <Link to={`products/categories/${id}`}>{t('edit')}</Link>
          </li>
          <li>
            <Delete id={id}>{t('delete')}</Delete>
          </li>
        </ButtonMore>
      </td>
    </tr>
  )
})

// table footer: x out of y results, x of y pages, prev/next page
// TODO if category is parent, then nest children
// TODO search button
const Categories = component(() => {
  const { t } = useTranslation('categories')
  // We assume there aren't more than 100 categories.
  // 1) because who makes that many anyway?
  // 2) https://github.com/einar-hjortdal/firebird/issues/1
  // TODO if there are more fetch more in another request
  const fetchAmount = 100
  const [offset, setOffset] = useState(0)
  const { data: productCategoriesData } = useCategories({ offset, fetch: fetchAmount })

  if (productCategoriesData) {
    const { categories } = productCategoriesData
    const rows = []
    for (let i = 0, len = categories.length; i < len; i++) {
      const productCategory = categories[i]
      rows.push(<Category productCategory={productCategory} />)
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')} subtitle={t('subtitle')}>
          <SecondaryButton>{t('editRanking')}</SecondaryButton>
          <Link to='/products/categories/new'>
            <PrimaryButton type='button'>{t('create')}</PrimaryButton>
          </Link>
        </CardHeader>
        <StyledTable>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('handle')}</th>
              <th>{t('status')}</th>
              <th>{t('visibility')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </StyledTable>
      </CardDefault>
    )
  }
})

export default Categories
