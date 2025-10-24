import {
  component,
  detectIsFunction,
  detectIsUndefined,
  useEffect,
  useMemo,
  useState
} from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import PrimaryButton from '../../buttons/PrimaryButton'
import Text from '../../input/Text'
import { getTranslation } from '../../../utils'
import { getCreationId, productOptionValueNameLength } from './utils'

// TODO handle other translations
// TODO add delete translation
const ProductOptionValue = component(({ optionValue, onChange, onDelete }) => {
  const { t } = useTranslation('productOptionEdit.value')
  const { data: storeData } = useStore()

  const [optionValueData, setOptionValueData] = useState(optionValue)
  useEffect(() => {
    setOptionValueData(optionValue)
  }, [optionValue])

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

  const handleClick = () => {
    onDelete(optionValue)
  }

  const handleBlur = () => {
    onChange(optionValueData)
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const { translations } = optionValueData
    const defaultTranslation = getTranslation(translations, defaultLocaleId).translation
    // TODO need delete button for each translation, if isDefault no delete button
    // TODO need delete button for whole optionValue, if isLast no delete button
    // TODO should input verification happen here to prevent onBlur of invalid inputs?
    // TODO onBlur is awkward: user has to actively click somewhere for data to be saved.
    return (
      <Text
        value={defaultTranslation.name}
        data-locale-id={defaultLocaleId}
        placeholder={t('placeholder')}
        maxLength={productOptionValueNameLength}
        onInput={handleInput}
        onBlur={handleBlur}
      >{t('values')}
      </Text>
    )
  }
})

// TODO maybe debounce oninput instead of onblur
const ProductOptionValues = component(({ option, onCreate, onChange, onDelete }) => {
  const { data: storeData } = useStore()

  const [isOpen, setIsOpen] = useState(false)

  const optionValueData = useMemo(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      return {
        id: getCreationId(),
        optionId: option.id,
        translations: [{ localeId: defaultLocaleId, name: '' }]
      }
    }
  }, [storeData, option])

  useEffect(() => {
    if (storeData) {
      setIsOpen(false)
    }
  }, [option])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleChange = (optionValueCreated) => {
    onCreate(optionValueCreated)
  }

  const handleDelete = () => {
    setIsOpen(false)
    // how do I make the child forget its state?
  }

  const { values } = option
  const valueInputs = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]

    valueInputs.push(
      <ProductOptionValue
        optionValue={value}
        onChange={onChange}
        onDelete={onDelete}
      />
    )
  }

  if (storeData && isOpen) {
    valueInputs.push(
      <ProductOptionValue
        optionValue={optionValueData}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    )
    return valueInputs
  }

  return (
    <>
      {valueInputs}
      <PrimaryButton type='button' onClick={handleOpen}>open</PrimaryButton>
    </>
  )
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
  useEffect(() => {
    setOptionData(option)
  }, [option])

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

  const handleOptionValueCreate = (optionValueCreated) => {
    const { values } = optionData

    const newOptionValues = [...values, optionValueCreated]

    setOptionData(prevState => {
      return { ...prevState, values: newOptionValues }
    })

    if (detectIsFunction(onOptionValueCreate)) { // undefined when creating new option
      onOptionValueCreate(optionValueCreated)
    }
  }

  const handleOptionValueChange = (optionValueUpdated) => {
    const { id } = optionValueUpdated
    const { values } = optionData
    const index = getOptionValueIndex(id)

    const newOptionValues = [...values]
    newOptionValues[index] = optionValueUpdated

    setOptionData(prevState => {
      return { ...prevState, values: newOptionValues }
    })

    if (detectIsFunction(onOptionValueUpdate)) { // undefined when creating new option
      onOptionValueUpdate(optionValueUpdated)
    }
  }

  const handleOptionValueDelete = (optionValueDeleted) => {
    const { id } = optionValueDeleted
    const { values } = optionData
    const index = getOptionValueIndex(id)

    const newOptionValues = [
      ...values.slice(0, index),
      ...values.slice(index + 1)
    ]

    setOptionData(prevState => {
      return { ...prevState, values: newOptionValues }
    })

    if (detectIsFunction(onOptionValueDelete)) { // undefined when creating new option
      onOptionValueDelete(optionValueDeleted)
    }
  }

  const isEmptyString = (s) => {
    return s.trim().length === 0 || s === ''
  }

  // TODO use onBlur instead of button click. Issue: needs a value to submit.
  // TODO disable inputs and show that saving is happening
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

        <ProductOptionValues
          option={optionData}
          onCreate={handleOptionValueCreate}
          onChange={handleOptionValueChange}
          onDelete={() => null}
        />

        <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
        <PrimaryButton type='button' onClick={handleDelete}>delete</PrimaryButton>
      </Container>
    )
  }
})

export default ProductOptionEdit
