import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import ButtonMore from '../../buttons/ButtonMore'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import CategoriesList from './CategoriesList'
import CategoriesEdit from './CategoriesEdit'

const StyledDiv = styled.div`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`

const OrganizeListItem = component(({ title, slot }) => {
  return (
    <li>
      <StyledDiv>{title}:</StyledDiv>
      <StyledDiv>{slot}</StyledDiv>
    </li>
  )
})

const Organize = component(({ categoryIds, onChange, disabled }) => {
  const { t } = useTranslation('products.organize')

  const handleCategoryIdsChange = (newCategoryIds) => {
    onChange({ categoryIds: newCategoryIds })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <ButtonMore>
          <li>
            {/* TODO  product type */}
            <CategoriesEdit
              categoryIds={categoryIds}
              onChange={handleCategoryIdsChange}
              disabled={disabled}
            />
            {/* TODO product tags */}
            {/* TODO product collections */}
          </li>
        </ButtonMore>
      </CardHeader>
      <ul>
        {/* TODO product type */}
        <OrganizeListItem title={t('categories')}>
          <CategoriesList categoryIds={categoryIds} />
        </OrganizeListItem>
        {/* TODO product tags */}
        {/* TODO product collections */}
      </ul>
    </CardDefault>
  )
})

export default Organize
