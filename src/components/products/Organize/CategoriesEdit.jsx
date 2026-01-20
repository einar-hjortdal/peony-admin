import {
  component,
  detectIsArray,
  detectIsNull,
  keys,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useCategories } from '../../../data'
import ModalDefault from '../../modals/ModalDefault'
import ModalBody from '../../modals/ModalBody'
import ModalFooter from '../../modals/ModalFooter'
import ModalHeader from '../../modals/ModalHeader'
import PrimaryButton from '../../buttons/PrimaryButton'

const SelectedCategory = component(({ productCategory, onRemove }) => {
  const { t } = useTranslation('products.organize.categories')
  const { name, id } = productCategory

  const handleClick = () => {
    onRemove(id)
  }

  return (
    <li>
      <span>{name}</span>
      <PrimaryButton type='button' onClick={handleClick}>{t('removeButton')}</PrimaryButton>
    </li>
  )
})

// shows selected categories with a remove button
const SelectedCategories = component(({ categoryIds, onRemove }) => {
  const { data: categoriesData } = useCategories()
  const productCategoriesMap = useMemo(() => {
    const res = {}
    if (categoriesData) {
      const { categories } = categoriesData
      for (let i = 0, len = categories.length; i < len; i++) {
        const productCategory = categories[i]
        const { id } = productCategory
        res[id] = productCategory
      }
    }
    return res
  }, [categoriesData])

  if (categoriesData) {
    const selectedCategories = []
    if (detectIsArray(categoryIds)) {
      for (let i = 0, len = categoryIds.length; i < len; i++) {
        const categoryId = categoryIds[i]
        const productCategory = productCategoriesMap[categoryId]
        selectedCategories.push(
          <SelectedCategory
            key={categoryId}
            productCategory={productCategory}
            categoryIds={categoryIds}
            onRemove={onRemove}
          />
        )
      }
    }

    return <ul>{selectedCategories}</ul>
  }
})

// shows a select element with all non-selected categories
// TODO build hierarchy and show indented children
const AddCategory = component(({ categoryIds, onAdd, disabled }) => {
  const { t } = useTranslation('products.organize.categories')
  const { data: categoriesData } = useCategories()
  const productCategoriesMap = useMemo(() => {
    const res = {}
    if (categoriesData) {
      const { categories } = categoriesData
      for (let i = 0, len = categories.length; i < len; i++) {
        const productCategory = categories[i]
        const { id } = productCategory
        res[id] = { ...productCategory, selected: false }
      }

      // mark selected
      if (detectIsArray(categoryIds)) {
        for (let i = 0, len = categoryIds.length; i < len; i++) {
          const id = categoryIds[i]
          res[id].selected = true
        }
      }
    }
    return res
  }, [categoryIds, categoriesData])

  const handleChange = (e) => {
    const { value } = e.target

    if (!value) {
      return
    }

    onAdd(value)
  }

  if (categoriesData) {
    const { categories } = categoriesData
    if (categories.length === 0) {
      return t('noCategories')
    }

    const options = []
    const productCategoryIds = keys(productCategoriesMap)
    for (let i = 0, len = productCategoryIds.length; i < len; i++) {
      const id = productCategoryIds[i]
      const productCategory = productCategoriesMap[id]
      const { name, selected } = productCategory
      if (!selected) {
        options.push(<option value={id} key={id}>{name}</option>)
      }
    }

    return (
      <select disabled={disabled} onChange={handleChange} defaultValue=''>
        <option value='' disabled>{t('placeholder')}</option>
        {options}
      </select>
    )
  }
})

const CategoriesEdit = component(({ categoryIds, onChange, disabled }) => {
  const { t } = useTranslation('products.organize.categories')

  const [newCategoryIds, setNewCategoryIds] = useState([])
  useEffect(() => {
    if (detectIsArray(categoryIds)) {
      setNewCategoryIds(categoryIds)
    }
  }, [categoryIds])

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

  const handleAdd = (categoryId) => {
    setNewCategoryIds((prevState) => {
      return [...prevState, categoryId]
    })
  }

  const handleRemove = (categoryId) => {
    setNewCategoryIds((prevState) => {
      const index = prevState.indexOf(categoryId)
      return [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1)
      ]
    })
  }

  const handleSave = () => {
    onChange(newCategoryIds)
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('editButton')}</button>
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />
        <ModalBody>
          <SelectedCategories categoryIds={newCategoryIds} onRemove={handleRemove} />
          <AddCategory categoryIds={newCategoryIds} onAdd={handleAdd} disabled={disabled} />
        </ModalBody>

        <ModalFooter>
          <PrimaryButton categoryIds={newCategoryIds} onClick={handleSave}>
            {t('saveButton')}
          </PrimaryButton>
        </ModalFooter>
      </ModalDefault>
    </>
  )
})

export default CategoriesEdit
