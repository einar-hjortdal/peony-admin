import { component, detectIsUndefined, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'
import ProductOptionValueEdit from './ProductOptionValueEdit'
import { getTranslation } from '../../../utils'

const Container = styled.div`
  border: 1px solid ${p => p.theme.neutral30};
  border-radius: .3125rem;
`

// TODO add more values
const ProductOptionEdit = component(({ option, onOptionUpdate, onOptionDelete }) => {
  const { t } = useTranslation('productOptionEdit')
  const { data: storeData } = useStore()
  const [optionData, setOptionData] = useState(option)

  const handleInput = (e) => {
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

  const handleOptionValueChange = (newOptionValue, index) => {
    const { values } = option
    const newOptionValues = [...values]
    newOptionValues[index] = newOptionValue
    setOptionData(prevState => {
      return { ...prevState, values: newOptionValues }
    })
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

    onOptionUpdate(optionData)
  }

  const handleDelete = () => {
    return onOptionDelete(optionData)
  }

  if (storeData) {
    const { translations, values } = optionData
    const { defaultLocaleId } = storeData.store

    const defaultOptionTranslation = getTranslation(translations, defaultLocaleId).translation

    const valueInputs = []
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]

      // attach optionValue index to handler
      const handleOptionValueChangeWithIndex = (newOptionValue) => {
        handleOptionValueChange(newOptionValue, i)
      }

      valueInputs.push(
        <ProductOptionValueEdit
          key={i}
          optionValue={value}
          onInput={handleOptionValueChangeWithIndex}
        />
      )
    }

    return (
      <Container>
        <Text
          value={defaultOptionTranslation.title}
          data-locale-id={defaultLocaleId}
          placeholder={t('placeholder')}
          onInput={handleInput}
        >{t('name')}
        </Text>

        {valueInputs}

        <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
        <PrimaryButton type='button' onClick={handleDelete}>delete</PrimaryButton>
      </Container>
    )
  }
})

export default ProductOptionEdit
