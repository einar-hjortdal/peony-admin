import { component, detectIsNull, detectIsUndefined, useEffect, useRef, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductCategories, useProductUpdateMutation } from '../../data'
import Card from '../../components/Card'
import ButtonMore from '../../components/Buttons/ButtonMore'
import If from '../../components/If'

const ProductCategoriesList = component(({ productCategories }) => {
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
})

// TODO: to add/remove categories
// first build an array of existing product_category id
// keep it up to date with user input: remove/add ids to the array
// on submit send it to /admin/product/:product_id post with payload {category_ids: [...]}
const EditCategories = component(({ productId, productCategories }) => {
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
  const { data: productCategoriesData } = useProductCategories()

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

  // const allProductCategories = productCategoriesData.productCategories
  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('button')}</button>
      <dialog ref={modalRef}>
        {/* TODO use a select element with one option per category? */}
      </dialog>
    </>
  )
})

const Categories = component(() => {
  const { t } = useTranslation('product.categories')
  const params = useParams()
  const productId = params.get('id')
  const { data: productCategoriesData } = useProductCategories({ product_ids: productId })
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  if (productCategoriesData) {
    const { productCategories } = productCategoriesData
    return (
      <Card>
        <Card.Header title={t('title')}>
          <ButtonMore type='button' onClick={handleClick} />
          <If condition={isOpen}>
            <ul>
              <li>
                <EditCategories productId={productId} productCategories={productCategories} />
                {/* should there even be more entries? Maybe just use an edit primary button */}
              </li>
            </ul>
          </If>
        </Card.Header>
        <div>
          <ProductCategoriesList productCategories={productCategories} />
        </div>
      </Card>
    )
  }
})

export default Categories
