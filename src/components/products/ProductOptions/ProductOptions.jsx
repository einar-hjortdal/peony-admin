import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import { getTranslation } from '../../../utils'
import ProductOptionEdit from './ProductOptionEdit'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'
import { getCreationId } from './utils'

const OptionTitle = styled.span`
  font-weight: 700;
`

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

const LeftListItem = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const RightListItem = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const Option = component(({
  option,
  onOptionUpdate,
  onOptionDelete,
  onOptionValueCreate,
  onOptionValueUpdate,
  onOptionValueDelete
}) => {
  const { t } = useTranslation('productOptions')
  const { data: storeData } = useStore()
  const [isEditing, setIsEditing] = useState(false)

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleStopEditing = () => {
    setIsEditing(false)
  }

  const handleUpdate = (optionUpdated) => {
    onOptionUpdate(optionUpdated)
    handleStopEditing()
  }

  const handleDelete = (optionDeleted) => {
    onOptionDelete(optionDeleted)
    handleStopEditing()
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const { values, translations } = option
    const translation = getTranslation(translations, defaultLocaleId).translation
    const title = translation.title

    if (isEditing) {
      return (
        <>
          <LeftListItem>
            <ProductOptionEdit
              option={option}
              onOptionUpdate={handleUpdate}
              onOptionDelete={handleDelete}
              onOptionValueCreate={onOptionValueCreate}
              onOptionValueUpdate={onOptionValueUpdate}
              onOptionValueDelete={onOptionValueDelete}
            />
          </LeftListItem>

          <RightListItem>
            <PrimaryButton
              type='button'
              onClick={handleStopEditing}
            >{t('cancel')}
            </PrimaryButton>
          </RightListItem>
        </>
      )
    }

    return (
      <>
        <LeftListItem>
          <OptionTitle>{title}</OptionTitle>
          <div>
            <OptionValuesPreview values={values} />
          </div>
        </LeftListItem>

        <RightListItem>
          <PrimaryButton
            type='button'
            onClick={handleStartEditing}
          >{t('edit')}
          </PrimaryButton>
        </RightListItem>
      </>
    )
  }
})

// TODO preview non-default translations
// TODO implement change logic (need component with internal state)
const AddOption = component(({ onAdd, slot }) => {
  const { data: storeData } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [optionData, setOptionData] = useState({})

  const getInitialData = () => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store
      // generate ids to identify changes to created options and values
      const optionId = getCreationId()
      const valueId = getCreationId()
      return {
        id: optionId,
        translations: [{ localeId: defaultLocaleId, title: '' }],
        values: [
          {
            optionId,
            id: valueId,
            translations: [{ localeId: defaultLocaleId, name: '' }]
          }
        ]
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
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    const initialData = getInitialData()
    setOptionData(initialData)
  }

  const handleSave = (newOptionData) => {
    onAdd(newOptionData)
    handleCancel()
  }

  if (storeData && isOpen) {
    return (
      <ProductOptionEdit
        option={optionData}
        onOptionUpdate={handleSave}
        onOptionDelete={handleCancel}
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

// options:
// - The current list of product options. undefined for a newly created product.
//
// onChange(payload):
// - payload always contains the full updated 'options' array.
// - payload also contains one change object: e.g., 'optionCreated', 'optionUpdated', 'optionDeleted',
//   'optionValueCreated', etc., depending on the action.
//
// Unsaved options and optionValues have numeric ids, you can use this to detect whether one object
// has been saved to the database.
const ProductOptions = component(({ options, onChange }) => {
  const { t } = useTranslation('productOptions')

  const handleOptionCreate = (optionCreated) => {
    if (detectIsUndefined(options)) {
      return onChange({
        options: [optionCreated],
        optionCreated
      })
    }

    return onChange({
      options: [...options, optionCreated],
      optionCreated
    })
  }

  const findOptionIndex = (optionId) => {
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      if (option.id === optionId) {
        return i
      }
    }
  }

  const findOptionValueIndex = (optionValues, optionValueId) => {
    for (let i = 0, len = optionValues.length; i < len; i++) {
      const optionValue = optionValues[i]
      if (optionValue.id === optionValueId) {
        return i
      }
    }
  }

  const handleOptionUpdate = (optionUpdated) => {
    const { id } = optionUpdated
    const index = findOptionIndex(id)
    const newOptions = [...options]
    newOptions[index] = optionUpdated
    return onChange({
      options: newOptions,
      optionUpdated
    })
  }

  const handleOptionDelete = (optionDeleted) => {
    const { id } = optionDeleted
    const index = findOptionIndex(id)
    // remove the option at the given index
    const newOptions = [
      ...options.slice(0, index),
      ...options.slice(index + 1)
    ]

    return onChange({
      options: newOptions,
      optionDeleted
    })
  }

  const handleOptionValueCreate = (optionValueCreated) => {
    const { optionId } = optionValueCreated
    const optionIndex = findOptionIndex(optionId)
    const option = options[optionIndex]
    const { values } = option

    const newValues = [...values, optionValueCreated]
    const newOption = { ...option, values: newValues }
    const newOptions = [...options]
    newOptions[optionIndex] = newOption

    return onChange({
      options: newOptions,
      optionValueCreated
    })
  }

  const handleOptionValueUpdate = (optionValueUpdated) => {
    const { id, optionId } = optionValueUpdated
    const optionIndex = findOptionIndex(optionId)
    const option = options[optionIndex]
    const { values } = option
    const optionValueIndex = findOptionValueIndex(values, id)

    const newValues = [...values]
    newValues[optionValueIndex] = optionValueUpdated

    const newOption = { ...option, values: newValues }

    const newOptions = [...options]
    newOptions[optionIndex] = newOption

    return onChange({
      options: newOptions,
      optionValueUpdated
    })
  }

  const handleOptionValueDelete = (optionValueDeleted) => {
    const { id, optionId } = optionValueDeleted
    const optionIndex = findOptionIndex(optionId)
    const option = options[optionIndex]
    const { values } = option
    const optionValueIndex = findOptionValueIndex(values, id)

    const newValues = [
      ...values.slice(0, optionValueIndex),
      ...values.slice(optionValueIndex + 1)
    ]

    const newOption = { ...option, values: newValues }

    const newOptions = [...options]
    newOptions[optionIndex] = newOption

    return onChange({
      options: newOptions,
      optionValueDeleted
    })
  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  const optionListItems = []
  if (options) {
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      optionListItems.push(
        <li>
          <Option
            option={option}
            onOptionUpdate={handleOptionUpdate}
            onOptionDelete={handleOptionDelete}
            onOptionValueCreate={handleOptionValueCreate}
            onOptionValueUpdate={handleOptionValueUpdate}
            onOptionValueDelete={handleOptionValueDelete}
          />
        </li>
      )
    }
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <ul>
        {optionListItems}
      </ul>

      <AddOption onAdd={handleOptionCreate}>{buttonText}</AddOption>
    </CardDefault>
  )
})

export default ProductOptions
