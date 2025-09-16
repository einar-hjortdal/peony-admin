import { component, detectIsNull, detectIsUndefined, useEffect, useRef, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useProductUpdateMutation } from '../../data'
import Card from '../../components/Card'
import ButtonMore from '../../components/Buttons/ButtonMore'
import If from '../../components/If'
import { styled } from '@dark-engine/styled'

const CategoriesList = component(({ productId }) => {
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    if (productCategories.length === 0) {
      return 'This product is not in any category'
    }

    const spans = []
    for (let i = 0, len = productCategories.length; i < len; i++) {
      const productCategory = productCategories[i]
      const { id, name } = productCategory
      spans.push(<span key={id}>{name}</span>)
    }
    return spans
  }
})

// TODO: to add/remove categories
// first build an array of existing product_category id
// keep it up to date with user input: remove/add ids to the array
// on submit send it to /admin/product/:product_id post with payload {category_ids: [...]}
const CategoriesEdit = component(({ productId }) => {
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    const { t } = useTranslation('product.categories.editCategories')
    const [categoryIds, setCategoryIds] = useState([])

    useEffect(() => {
      const ids = []
      for (let i = 0, len = productCategories.length; i < len; i++) {
        const productCategory = productCategories[i]
        const { id } = productCategory
        ids.push(id)
      }
      setCategoryIds(ids)
    }, [productCategories])

    const [updateProduct] = useProductUpdateMutation(productId)
    const { data: allProductCategoriesData } = useProductCategories()

    const modalRef = useRef(null)
    const handleOpenModal = () => {
      if (detectIsNull(modalRef)) {
        return
      }
      modalRef.current.showModal()
    }

    const handleCloseModal = () => {
      if (detectIsNull(modalRef)) {
        return
      }
      modalRef.current.close()
    }

    // const allProductCategories = allProductCategoriesData.productCategories
    return (
      <>
        <button type='button' onClick={handleOpenModal}>{t('button')}</button>
        <dialog ref={modalRef}>
          {/* TODO use a select element with one option per category? */}
        </dialog>
      </>
    )
  }
})

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
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card>
      <Card.Header title={t('title')}>
        <ButtonMore type='button' onClick={handleClick} />
        <If condition={isOpen}>
          <ul>
            <li>
              <CategoriesEdit productId={productId} />
              {/* TODO  product type */}
              {/* TODO product tags */}
              {/* TODO product collections */}
            </li>
          </ul>
        </If>
      </Card.Header>
      <ul>
        <OrganizeListItem title={t('categories')}>
          <CategoriesList productId={productId} />
        </OrganizeListItem>
        {/* TODO product type */}
        {/* TODO product tags */}
        {/* TODO product collections */}
      </ul>
    </Card>
  )
})

export default Organize
