import { component, detectIsFunction, detectIsUndefined, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'
import { getTranslation } from '../../../utils'

// TODO handle other translations
// TODO add delete translation
const ProductOptionValue = component(({ optionValue, onChange }) => {
  const { t } = useTranslation('productOptionEdit.value')
  const { data: storeData } = useStore()
  const [optionValueData, setOptionValueData] = useState(optionValue)

  const handleInput = (e) => {
    const { value } = e.target
    const { localeId } = e.target.dataset

    setOptionValueData(prevState => {
      const { translations } = prevState
      const newTranslations = [...translations]
      const translation = getTranslation(translations, localeId)
      const newTranslation = { localeId, name: value }

      if (detectIsUndefined(translation)) {
        newTranslations.push(newTranslation)
      } else {
        newTranslations[translation.index] = newTranslation
      }

      return { ...prevState, translations: newTranslations }
    })
  }

  const handleBlur = () => {
    onChange(optionValueData)
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const { translations } = optionValueData
    const defaultTranslation = getTranslation(translations, defaultLocaleId).translation
    // if isDefault no delete button
    return (
      <Text
        value={defaultTranslation.name}
        data-locale-id={defaultLocaleId}
        placeholder={t('placeholder')}
        onInput={handleInput}
        onBlur={handleBlur}
      >{t('values')}
      </Text>
    )
  }
})

// TODO allow adding multiple values
const ProductOptionValues = component(({ option, onChange }) => {
  const { values } = option

  const valueInputs = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]

    valueInputs.push(<ProductOptionValue optionValue={value} onChange={onChange} />)
  }

  return valueInputs
})

const Container = styled.div`
  border: 1px solid ${p => p.theme.neutral30};
  border-radius: .3125rem;
`

const ProductOptionEdit = component(({
  option,
  onOptionUpdate,
  onOptionDelete,
  onOptionValueCreate,
  onOptionValueUpdate,
  onOptionValueDelete
}) => {
  const { t } = useTranslation('productOptionEdit')
  const { data: storeData } = useStore()
  const [optionData, setOptionData] = useState(option)

  const handleOptionInput = (e) => {
    const { value } = e.target
    const { localeId } = e.target.dataset

    setOptionData(prevState => {
      const { translations } = prevState
      const newTranslations = [...translations]
      const translation = getTranslation(translations, localeId)

      if (detectIsUndefined(translation)) {
        newTranslations.push({ localeId, title: value })
        return { ...prevState, translations: newTranslations }
      }

      const { index } = translation
      const newTranslation = { ...newTranslations[index], title: value }
      newTranslations[index] = newTranslation
      return { ...prevState, translations: newTranslations }
    })
  }

  const getOptionValueIndex = (id) => {
    const { values } = option
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      if (value.id === id) {
        return i
      }
    }
  }

  const handleOptionValueChange = (newOptionValue) => {
    const { id } = newOptionValue
    const { values } = option
    const index = getOptionValueIndex(id)
    const newOptionValues = [...values]
    newOptionValues[index] = newOptionValue
    setOptionData(prevState => {
      return { ...prevState, values: newOptionValues }
    })

    if (detectIsFunction(onOptionValueUpdate)) { // undefined when creating new option
      onOptionValueUpdate(newOptionValue)
    }
  }

  const isEmptyString = (s) => {
    return s.trim().length === 0 || s === ''
  }

  const handleSave = () => {
    const { defaultLocaleId } = storeData.store
    const { translations, values } = optionData
    if (translations.length === 0 || values.length === 0) {
      console.error(`translations.length: ${translations.length}, values.length :${values.length}`)
      return // TODO error
    }

    let defaultOptionTranslationExists = false
    for (let i = 0, len = translations.length; i < len; i++) {
      const { localeId, title } = translations[i]

      if (localeId === defaultLocaleId) {
        defaultOptionTranslationExists = true

        if (isEmptyString(title)) {
          console.error('default title is empty')
          return // TODO error
        }
      }
    }

    if (!defaultOptionTranslationExists) {
      console.error('default option translation doesn\'t exist')
      return // TODO error
    }

    for (let i = 0, len = values.length; i < len; i++) {
      const { translations } = values[i]
      let defaultValueTranslationExists = false

      for (let j = 0, jlen = translations.length; j < jlen; j++) {
        const { localeId, name } = translations[j]

        if (localeId === defaultLocaleId) {
          defaultValueTranslationExists = true

          if (isEmptyString(name)) {
            console.error('default name is empty')
            return // TODO error
          }
        }
      }

      if (!defaultValueTranslationExists) {
        console.error('default value translation doesn\'t exist')
        return // TODO error
      }
    }

    // TODO split save logic so that changes are done individually
    // Splitting save logic allows to maintain atomicity
    // use onBlur for now, eventually group all related translation inputs of the same optionValue to the same event.
    // TODO what event is suitable?
    onOptionUpdate(optionData)
    // onOptionValueUpdate()
  }

  const handleDelete = () => {
    return onOptionDelete(optionData)
  }

  if (storeData) {
    const { translations } = optionData
    const { defaultLocaleId } = storeData.store

    const defaultOptionTranslation = getTranslation(translations, defaultLocaleId).translation

    return (
      <Container>
        <Text
          value={defaultOptionTranslation.title}
          data-locale-id={defaultLocaleId}
          placeholder={t('placeholder')}
          onInput={handleOptionInput}
        >{t('name')}
        </Text>

        <ProductOptionValues option={optionData} onChange={handleOptionValueChange} />

        <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
        <PrimaryButton type='button' onClick={handleDelete}>delete</PrimaryButton>
      </Container>
    )
  }
})

export default ProductOptionEdit
