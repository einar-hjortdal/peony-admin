import { component, detectIsUndefined, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'

import { getTranslation } from './utils'
import { useStore } from '../../data'
import PrimaryButton from '../buttons/PrimaryButton'
import Text from '../input/Text'

const Container = styled.div`
  border: 1px solid ${p => p.theme.neutral30};
  border-radius: .3125rem;
`

// TODO refactor, the index game is too complex, just return a whole values array or the whole value
const ProductOptionValueEdit = component(({ value, index, defaultLocaleId, onInput }) => {
  const { translations } = value
  const defaultTranslation = getTranslation(translations, defaultLocaleId).translation
  console.log(defaultTranslation)
  // if isDefault no delete
  return (
    <Text
      name='name'
      value={defaultTranslation.name}
      data-locale-id={defaultTranslation.localeId}
      data-index={index}
      placeholder='Green' // TODO change to t func
      onInput={onInput}
    />
  )
})

const ProductOptionEdit = component(({ option, saveOption, deleteOption }) => {
  const { data: storeData } = useStore()
  const [optionData, setOptionData] = useState(option)

  const handleInput = (e) => {
    const { name, value } = e.target
    const { localeId } = e.target.dataset

    if (name === 'title') { // option
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

    if (name === 'name') { // value
      const { index } = e.target.dataset
      setOptionData(prevState => {
        const newValues = [...prevState.values]
        const newValue = { localeId, name: value }
        newValues[index] = newValue
        return { ...prevState, values: newValues }
      })
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

    saveOption(optionData)
  }

  console.log(optionData)

  if (storeData) {
    const { translations, values } = option
    const { defaultLocaleId } = storeData.store

    const defaultOptionTranslation = getTranslation(translations, defaultLocaleId).translation

    const valueInputs = []
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      valueInputs.push(
        <ProductOptionValueEdit
          key={i}
          value={value}
          index={i}
          defaultLocaleId={defaultLocaleId}
          onInput={handleInput}
        />
      )
    }

    return (
      <Container>
        <Text
          name='title'
          value={defaultOptionTranslation.title}
          data-locale-id={defaultLocaleId}
          placeholder='Color' // TODO change to t func
          onInput={handleInput}
        />

        {valueInputs}

        <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
        <PrimaryButton type='button' onClick={deleteOption}>delete</PrimaryButton>
        {/* delete, save buttons */}
      </Container>
    )
  }
})

export default ProductOptionEdit
