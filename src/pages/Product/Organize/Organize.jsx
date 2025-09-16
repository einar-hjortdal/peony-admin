import { component, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../../../components/Card'
import ButtonMore from '../../../components/Buttons/ButtonMore'
import If from '../../../components/If'
import { styled } from '@dark-engine/styled'
import CategoriesEdit from './CategoriesEdit'
import CategoriesList from './CategoriesList'

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

const Wrapper = styled.div`
  position: relative;
`

const StyledUl = styled.ul`
  position: absolute;
  top: 1.5rem;
  right: 0;
  white-space: nowrap;
`

const Organize = component(() => {
  const { t } = useTranslation('product.organize')
  const params = useParams()
  const productId = params.get('id')

  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card>
      <Card.Header title={t('title')}>
        <Wrapper>
          <ButtonMore type='button' onClick={handleClick} />
          <If condition={isOpen}>
            <StyledUl>
              <li>
                {/* TODO  product type */}
                <CategoriesEdit productId={productId} />
                {/* TODO product tags */}
                {/* TODO product collections */}
              </li>
            </StyledUl>
          </If>
        </Wrapper>
      </Card.Header>
      <ul>
        {/* TODO product type */}
        <OrganizeListItem title={t('categories')}>
          <CategoriesList productId={productId} />
        </OrganizeListItem>
        {/* TODO product tags */}
        {/* TODO product collections */}
      </ul>
    </Card>
  )
})

export default Organize
