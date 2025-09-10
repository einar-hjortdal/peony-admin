import { component, detectIsNull, detectIsUndefined, keys, useRef, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { useTranslation } from '@wareme/translations'
import ModalFull from '../../components/Modals/ModalFull'
import { useProductCategoryCreateMutation, useStore } from '../../data'
import PrimaryButton from '../../components/Buttons/PrimaryButton'

const StyledLabel = styled.label`
  display: block;
`

const NewCategory = component(({ modalRef }) => {
  const { t } = useTranslation('categories.newCategory')
  const { data: storeData } = useStore()
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
    const fieldValue = getFieldValue(e)
    const { name, dataset } = e.target
    const { localeId } = dataset

    if (localeId) {
      return setCategoryData((prevState) => {
        const newState = { ...prevState }
        if (detectIsUndefined(newState.translations)) {
          newState.translations = {}
        }

        if (detectIsUndefined(newState.translations[localeId])) {
          newState.translations[localeId] = {}
        }

        newState.translations[localeId][name] = fieldValue
        return newState
      })
    }

    return setCategoryData((prevState) => {
      return {
        ...prevState,
        [name]: fieldValue
      }
    })
  }

  const getValue = (localeId, name) => {
    const { translations } = categoryData
    if (detectIsUndefined(translations)) {
      return
    }

    const localeTranslations = categoryData[localeId]
    if (detectIsUndefined(localeTranslations)) {
      return
    }

    const translation = localeTranslations[name]
    if (detectIsUndefined(translation)) {
      return
    }

    return translation
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { translations, ...requestData } = categoryData
    const localeIds = keys(translations)
    const newTranslations = []
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      const translation = translations[localeId]
      translation.localeId = localeId
      newTranslations.push(translation)
    }
    requestData.translations = newTranslations
    createCategory(requestData)
  }

  if (storeData) {
    const { store } = storeData
    const { defaultLocaleId } = store
    // TODO handle translations

    return (
      <ModalFull ref={modalRef} title={t('title')} handleClose={handleCloseModal}>
        <ModalFull.Body>
          <form ref={formRef}>
            <StyledLabel onClick={handleLabelClick}>
              {t('name')}
              <input
                type='text'
                name='name'
                required
                data-locale-id={defaultLocaleId}
                value={getValue(defaultLocaleId, 'name')}
                onInput={handleInput}
              />
            </StyledLabel>

            <StyledLabel onClick={handleLabelClick}>
              {t('description')}
              <input
                type='text'
                name='description'
                data-locale-id={defaultLocaleId}
                value={getValue(defaultLocaleId, 'description')}
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
        </ModalFull.Body>

        <ModalFull.Footer>
          <PrimaryButton type='submit' onClick={handleSubmit}>
            {t('save')}
          </PrimaryButton>
        </ModalFull.Footer>
      </ModalFull>
    )
  }
})

export default NewCategory
