import { component, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import ButtonMore from '../../../components/Buttons/ButtonMore'
import { styled } from '@dark-engine/styled'
import CategoriesEdit from './CategoriesEdit'
import CategoriesList from './CategoriesList'
import CardDefault from '../../../components/Cards/CardDefault'
import CardHeader from '../../../components/Cards/CardHeader'

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

const Organize = component(() => {
  const { t } = useTranslation('product.organize')
  const params = useParams()
  const productId = params.get('id')

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <ButtonMore>
          <ul>
            <li>
              {/* TODO  product type */}
              <CategoriesEdit productId={productId} />
              {/* TODO product tags */}
              {/* TODO product collections */}
            </li>
          </ul>
        </ButtonMore>
      </CardHeader>
      <ul>
        {/* TODO product type */}
        <OrganizeListItem title={t('categories')}>
          <CategoriesList productId={productId} />
        </OrganizeListItem>
        {/* TODO product tags */}
        {/* TODO product collections */}
      </ul>
    </CardDefault>
  )
})

export default Organize
