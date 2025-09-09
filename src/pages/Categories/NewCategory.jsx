import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { useTranslation } from '@wareme/translations'
import ModalFull from '../../components/Modals/ModalFull'
import { useProductCategoryCreateMutation } from '../../data'

const StyledLabel = styled.label`
  display: block;
`

// TODO translations
const NewCategory = component(({ modalRef }) => {
  const { t } = useTranslation('categories.newCategory')
  const formRef = useRef(null)

  const [categoryData, setCategoryData] = useState({})
  const [createCategory] = useProductCategoryCreateMutation()

  const handleCloseModal = () => {
    if (detectIsNull(modalRef) || detectIsNull(modalRef.current)) {
      return
    }

    formRef.current.reset()
    // TODO clear state
    modalRef.current.close()
  }

  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  const getFieldValue = (e) => {
    const { type, value, checked } = e.target
    if (type === 'checkbox') {
      return checked
    }
    return value
  }

  const handleInput = (e) => {
    const { name } = e.target
    setCategoryData((prevState) => {
      return {
        ...prevState,
        [name]: getFieldValue(e)
      }
    })
  }

  const handleSubmit = () => {
    createCategory(categoryData)
  }

  console.log(categoryData)

  return (
    <ModalFull ref={modalRef} title={t('title')} handleClose={handleCloseModal}>
      <form ref={formRef}>
        <StyledLabel onClick={handleLabelClick}>
          {t('name')}
          <input
            type='text'
            name='name'
            value={categoryData.name}
            onInput={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('description')}
          <input
            type='text'
            name='description'
            value={categoryData.description}
            onInput={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('handle')}
          <input
            type='text'
            name='handle'
            value={categoryData.handle}
            onInput={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('visibility')}
          <input
            type='checkbox'
            name='isInternal'
            value={categoryData.isInternal}
            onChange={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('status')}
          <input
            type='checkbox'
            name='isActive'
            value={categoryData.isActive}
            onChange={handleInput}
          />
        </StyledLabel>
      </form>
    </ModalFull>
  )
})

export default NewCategory
