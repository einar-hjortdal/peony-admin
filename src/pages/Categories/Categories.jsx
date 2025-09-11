import { component, detectIsArray, detectIsNull, detectIsUndefined, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useStore } from '../../data'
import Card from '../../components/Card'
import ButtonMore from '../../components/Buttons/ButtonMore'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import SecondaryButton from '../../components/Buttons/SecondaryButton'
import CategoryNew from './CategoryNew'
import If from '../../components/If'
import CategoryEdit from './CategoryEdit'

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

const StyledUl = styled.ul`
  position: absolute;
`

const Category = component(({ productCategory }) => {
  const { t } = useTranslation('categories.category')
  const { handle, isActive, isInternal, name } = productCategory
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{handle}</td>
      <td><Status isActive={isActive} /></td>
      <td><Visibility isInternal={isInternal} /></td>
      <td>
        <ButtonMore onClick={toggleOpen} />
        <If condition={isOpen}>
          <StyledUl>
            <li>
              <CategoryEdit productCategory={productCategory} />
            </li>
          </StyledUl>
        </If>
      </td>
    </tr>
  )
})

// table footer: x out of y results, x of y pages, prev/next page
// TODO if category is parent, then nest children
// TODO search button
const Categories = component(() => {
  const { t } = useTranslation('categories')
  const fetchAmount = 15
  const [offset, setOffset] = useState(0)
  const { data: productCategoriesData } = useProductCategories({ offset, fetch: fetchAmount })

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    modalRef.current.showModal()
  }

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    const rows = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const productCategory = productCategories[i]
      rows.push(<Category productCategory={productCategory} />)
    }

    return (
      <Card>
        <Card.Header title={t('title')} subtitle={t('subtitle')}>
          <SecondaryButton>{t('editRanking')}</SecondaryButton>
          <PrimaryButton
            type='button'
            disabled={detectIsNull(modalRef)}
            onClick={handleOpenModal}
          >{t('create')}
          </PrimaryButton>
          <CategoryNew modalRef={modalRef} />
        </Card.Header>
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
      </Card>
    )
  }
})

export default Categories
