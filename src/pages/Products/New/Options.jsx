import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../../../components/Cards/CardDefault'
import CardHeader from '../../../components/Cards/CardHeader'
import ButtonMore from '../../../components/Buttons/ButtonMore'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import If from '../../../components/If'
import { useStore } from '../../../data'
import Text from '../../../components/input/Text'

const Container = styled.div`
  border: 1px solid ${p => p.theme.neutral30};
  border-radius: .3125rem;
`

const AddButton = styled.button`
  text-align: unset;
  cursor: pointer;
  padding-top: .5725rem;
  padding-bottom: .5725rem;
  padding-right: 1.125rem;
  padding-left: 1.125rem;
  background-color: unset;
  border-radius: .3125rem;
  transition: background-color 0.2s;
  
  &:hover{
    background-color: ${p => p.theme.neutral20};
  }

  &:disabled{
    color: ${p => p.theme.neutral80};
    background-color: ${p => p.theme.neutral20};
  }
`

const Preview = component(({ option }) => {
  const { title, values } = option

  const valuesPreview = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]
    const { name } = value
    valuesPreview.push(<span key={name}>{name}</span>)
  }

  return (
    <div>
      <span>{title}</span>
      {valuesPreview}
    </div>
  )
})

const OptionsPreview = component(({ options }) => {
  if (detectIsUndefined(options)) {
    return
  }

  const optionsPreview = []
  for (let i = 0, len = options.length; i < len; i++) {
    const option = options[i]
    const { id } = option
    optionsPreview.push(<Preview key={id} />)
  }

  return optionsPreview
})

const getTranslation = (translations, localeId) => {
  for (let i = 0, len = translations.length; i < len; i++) {
    const translation = translations[i]
    if (translation.localeId === localeId) {
      return { index: i, translation }
    }
  }
  // returns undefined if the translations array does not contain the translation with localeId
}

const Edit = component(({ option, saveOption, deleteOption }) => {
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

  if (storeData) {
    const { translations, values } = option
    const { defaultLocaleId } = storeData.store

    const defaultOptionTranslation = getTranslation(translations, defaultLocaleId).translation

    return (
      <Container>
        <Text
          name='title'
          value={defaultOptionTranslation.title}
          data-locale-id={defaultLocaleId}
          placeholder='Color' // TODO change to t func
          onInput={handleInput}
        />
        {/* values */}

        <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
        <PrimaryButton type='button' onClick={deleteOption}>delete</PrimaryButton>
        {/* delete, save buttons */}
      </Container>
    )
  }
})

const AddOption = component(({ buttonText, onAdd }) => {
  const { data: storeData } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [optionData, setOptionData] = useState({})

  const getInitialData = () => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store
      return {
        translations: [{ localeId: defaultLocaleId, title: '' }],
        values: [{ translations: [{ localeId: defaultLocaleId, name: '' }] }]
      }
    }
  }

  useEffect(() => {
    const initialData = getInitialData()
    if (initialData) {
      setOptionData(initialData)
    }
  }, [storeData])

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleDelete = () => {
    const initialData = getInitialData()
    setOptionData(initialData)
    setIsOpen(false)
  }

  const handleSave = () => {
    onAdd(optionData)
    handleDelete()
  }
  console.log(optionData)

  if (storeData && isOpen) {
    return (
      <Edit
        option={optionData}
        saveOption={handleSave}
        deleteOption={handleDelete}
      />
    )
  }

  return (
    <AddButton
      type='button'
      disabled={isOpen}
      onClick={handleOpen}
    >{buttonText}
    </AddButton>
  )
})

const Options = component(({ options, onChange }) => {
  const { t } = useTranslation('productsNew.options')

  const handleChange = (newOptions) => {
    onChange(newOptions)
  }

  const handleAdd = (newOption) => {
    const newOptions = { ...options, newOption }
    onChange(newOptions)
  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <OptionsPreview options={options} />

      <AddOption buttonText={buttonText} onAdd={handleAdd} />
    </CardDefault>
  )
})

export default Options
