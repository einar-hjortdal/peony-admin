import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import { getTranslation } from '../../../utils'
import ProductOptionEdit from './ProductOptionEdit'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'

const OptionContainer = styled.div`

`

const OptionTitle = styled.span`
  font-weight: 700;
`

const OptionValuesContainer = styled.div``

// TODO preview non-default translations
const OptionValuesPreview = component(({ values }) => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const valuesPreview = []
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      const { translations } = value
      const translation = getTranslation(translations, defaultLocaleId).translation
      const name = translation.name
      valuesPreview.push(<span key={name}>{name}</span>)
    }
    return valuesPreview
  }
})

// TODO preview non-default translations
// TODO implement change logic (need component with internal state)
const OptionsPreview = component(({ options, onChange }) => {
  const { data: storeData } = useStore()

  if (options && storeData) {
    const { defaultLocaleId } = storeData.store

    const optionsPreview = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { values, translations } = option
      const translation = getTranslation(translations, defaultLocaleId).translation
      const title = translation.title
      optionsPreview.push(
        <OptionContainer>
          <OptionTitle>{title}</OptionTitle>
          <OptionValuesContainer>
            <OptionValuesPreview values={values} />
          </OptionValuesContainer>
        </OptionContainer>
      )
    }
    return optionsPreview
  }
})

const AddOption = component(({ onAdd, slot }) => {
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

  const handleCancel = () => {
    const initialData = getInitialData()
    setOptionData(initialData)
    setIsOpen(false)
  }

  const handleSave = (newOptionData) => {
    onAdd(newOptionData)
    handleCancel()
  }

  if (storeData && isOpen) {
    return (
      <ProductOptionEdit
        option={optionData}
        saveOption={handleSave}
        deleteOption={handleCancel}
      />
    )
  }

  return (
    <PrimaryButton
      type='button'
      disabled={isOpen}
      onClick={handleOpen}
    >{slot}
    </PrimaryButton>
  )
})

// Manages product options for both new product creation (options = undefined)
// and existing product editing (options = array).
//
// PROP: options
// - The current list of product options. Be prepared to handle 'undefined'
//   for a newly created product.
//
// PROP: onChange(payload)
// - Callback called on any change (add, edit, delete).
// - PAYLOAD always contains the FULL, updated 'options' array.
// - PAYLOAD also contains ONE change object: e.g., 'addedOption',
//   'changedOption', 'deletedOptionValue', etc., depending on the action.
const ProductOptions = component(({ options, onChange }) => {
  const { t } = useTranslation('productsNew.options')

  const handleChange = (newOptions, changedOption) => {
    onChange({
      options: newOptions,
      optionChanged: changedOption
    })
  }

  const handleAdd = (newOption) => {
    const res = {}
    if (detectIsUndefined(options)) {
      res.options = [newOption]
    } else {
      res.options = [...options, newOption]
    }
    res.optionAdded = newOption
    onChange(res)
  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <OptionsPreview options={options} onChange={handleChange} />

      <AddOption onAdd={handleAdd}>{buttonText}</AddOption>
    </CardDefault>
  )
})

export default ProductOptions
