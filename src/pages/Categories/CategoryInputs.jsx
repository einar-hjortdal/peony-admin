import { component, detectIsArray, detectIsObject, detectIsUndefined, keys, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { useStore } from '../../data'
import { useTranslation } from '@wareme/translations'

const StyledLabel = styled.label`
  display: block;
`

const CategoryInputs = component(({ formId, formRef, categoryData, onChange, onSubmit }) => {
  const { t } = useTranslation('categories.categoryInputs')
  const { data: storeData } = useStore()

  const [newCategoryData, setNewCategoryData] = useState({})

  const handleOnChange = (computedState) => {
    const { translations, ...requestData } = computedState
    if (translations) {
      const localeIds = keys(translations)
      const newTranslations = []
      for (let i = 0, len = localeIds.length; i < len; i++) {
        const localeId = localeIds[i]
        const translation = translations[localeId]
        translation.localeId = localeId
        newTranslations.push(translation)
      }
      requestData.translations = newTranslations
    }
    return onChange(requestData)
  }

  useEffect(() => {
    if (categoryData) {
      const { isActive, isInternal, handle } = categoryData
      const initialData = { handle, isActive, isInternal }

      // when category is new, translations is undefined
      if (detectIsArray(categoryData.translations)) {
        const translations = {}
        for (let i = 0, len = categoryData.translations.length; i < len; i++) {
          const translation = categoryData.translations[i]
          const { localeId, name, description } = translation
          translations[localeId] = { name, description }
        }
        initialData.translations = translations
      }

      setNewCategoryData(initialData)
      handleOnChange(initialData)
    }
  }, [categoryData])

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

  const getValue = (localeId, name) => {
    const { translations } = newCategoryData
    if (detectIsUndefined(translations)) {
      return
    }

    const localeTranslations = translations[localeId]
    if (detectIsUndefined(localeTranslations)) {
      return
    }

    const translation = localeTranslations[name]
    if (detectIsUndefined(translation)) {
      return
    }

    return translation
  }

  const handleInput = (e) => {
    const fieldValue = getFieldValue(e)
    const { name, dataset } = e.target
    const { localeId } = dataset

    if (localeId) {
      return setNewCategoryData((prevState) => {
        const newState = { ...prevState }
        if (detectIsUndefined(newState.translations)) {
          newState.translations = {}
        }

        if (detectIsUndefined(newState.translations[localeId])) {
          newState.translations[localeId] = {}
        }

        newState.translations[localeId][name] = fieldValue
        handleOnChange(newState)
        return newState
      })
    }

    return setNewCategoryData((prevState) => {
      const newState = { ...prevState, [name]: fieldValue }
      handleOnChange(newState)
      return newState
    })
  }

  if (storeData) {
    const { store } = storeData
    const { defaultLocaleId } = store

    return (
      <form id={formId} ref={formRef} onSubmit={onSubmit}>
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
            value={newCategoryData.handle}
            onInput={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('visibility')}
          <input
            type='checkbox'
            name='isInternal'
            value={newCategoryData.isInternal}
            onChange={handleInput}
          />
        </StyledLabel>

        <StyledLabel onClick={handleLabelClick}>
          {t('status')}
          <input
            type='checkbox'
            name='isActive'
            value={newCategoryData.isActive}
            onChange={handleInput}
          />
        </StyledLabel>
      </form>
    )
  }
})

export default CategoryInputs
