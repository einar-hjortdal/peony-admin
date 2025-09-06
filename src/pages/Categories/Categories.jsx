import { component, detectIsArray, detectIsNull, detectIsUndefined, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useStore } from '../../data'
import Card from '../../components/Card'
import ButtonMore from '../../components/Buttons/ButtonMore'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import SecondaryButton from '../../components/Buttons/SecondaryButton'
import NewCategory from './NewCategory'

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

const Name = component(({ translations }) => {
  const { data: storeData } = useStore()

  const getDefaultName = (defaultLocaleId) => {
    for (let i = 0, len = translations.length; i < len; i++) {
      const translation = translations[i]
      if (translation.localeId === defaultLocaleId) {
        return translation.name
      }
    }
    return '-'
  }

  if (storeData) {
    const { store } = storeData
    const { defaultLocaleId } = store
    return getDefaultName(translations, defaultLocaleId)
  }
})

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
    for (let i = 0, len = productCategories.len; i < len; i++) {
      const productCategory = productCategories[i]
      const { handle, isActive, isInternal, translations } = productCategory
      rows.push(
        <tr>
          <td><Name translations={translations} /></td>
          <td>{handle}</td>
          <td><Status isActive={isActive} /></td>
          <td><Visibility isInternal={isInternal} /></td>
          <td>
            <ButtonMore />
          </td>
        </tr>
      )
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
          <NewCategory modalRef={modalRef} />
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
